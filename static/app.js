/* =========================================================
   MARKET WATCH
   Frontend application logic
   ========================================================= */

const form = document.getElementById("watchlist-form");
const symbolInput = document.getElementById("symbol-input");
const addButton = document.getElementById("add-button");

const watchlistContainer =
    document.getElementById("watchlist-container");

const loadingState =
    document.getElementById("loading-state");

const emptyState =
    document.getElementById("empty-state");

const message =
    document.getElementById("message");

const watchlistCount =
    document.getElementById("watchlist-count");

const refreshButton =
    document.getElementById("refresh-button");

const statusDot =
    document.getElementById("status-dot");

const statusText =
    document.getElementById("status-text");


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    await checkHealth();
    await loadWatchlist();
});


/* =========================================================
   HEALTH CHECK
   ========================================================= */

async function checkHealth() {

    try {

        const response = await fetch("/healthz");

        if (!response.ok) {
            throw new Error("Health check failed");
        }

        setConnectionStatus(true);

    } catch (error) {

        console.error("Health check error:", error);

        setConnectionStatus(false);
    }
}


function setConnectionStatus(connected) {

    if (connected) {

        statusDot.classList.remove("disconnected");
        statusDot.classList.add("connected");

        statusText.textContent = "Connected";

    } else {

        statusDot.classList.remove("connected");
        statusDot.classList.add("disconnected");

        statusText.textContent = "Disconnected";
    }
}


/* =========================================================
   LOAD WATCHLIST
   ========================================================= */

async function loadWatchlist() {

    showLoading(true);
    hideMessage();

    try {

        const response = await fetch("/watchlist");

        if (!response.ok) {
            throw new Error("Unable to load watchlist");
        }

        const data = await response.json();

        /*
         * Supports either:
         *
         * [
         *   {...},
         *   {...}
         * ]
         *
         * or:
         *
         * {
         *   "items": [...]
         * }
         */

        const stocks = Array.isArray(data)
            ? data
            : data.items || [];

        renderWatchlist(stocks);

        setConnectionStatus(true);

    } catch (error) {

        console.error("Load watchlist error:", error);

        setConnectionStatus(false);

        showMessage(
            "Unable to load your watchlist. Please try again.",
            "error"
        );

    } finally {

        showLoading(false);
    }
}


/* =========================================================
   RENDER WATCHLIST
   ========================================================= */

function renderWatchlist(stocks) {

    watchlistContainer.innerHTML = "";

    watchlistCount.textContent =
        `${stocks.length} ${stocks.length === 1 ? "stock" : "stocks"}`;


    if (stocks.length === 0) {

        emptyState.classList.remove("hidden");

        return;
    }

    emptyState.classList.add("hidden");


    stocks.forEach(stock => {

        const card = createStockCard(stock);

        watchlistContainer.appendChild(card);
    });
}


/* =========================================================
   CREATE STOCK CARD
   ========================================================= */

function createStockCard(stock) {

    const card = document.createElement("div");

    card.className = "stock-card";


    const stockInfo = document.createElement("div");

    stockInfo.className = "stock-info";


    const symbolBadge = document.createElement("div");

    symbolBadge.className = "stock-symbol-wrapper";

    symbolBadge.textContent =
        String(stock.symbol || "?").substring(0, 4);


    const details = document.createElement("div");

    details.className = "stock-details";


    const symbol = document.createElement("div");

    symbol.className = "stock-symbol";

    symbol.textContent =
        stock.symbol || "Unknown";


    const updated = document.createElement("div");

    updated.className = "stock-updated";

    updated.textContent =
        formatUpdatedTime(stock.updated_at);


    details.appendChild(symbol);
    details.appendChild(updated);

    stockInfo.appendChild(symbolBadge);
    stockInfo.appendChild(details);


    /* -----------------------------
       Right side
       ----------------------------- */

    const rightSide = document.createElement("div");

    rightSide.className = "stock-right";


    const price = document.createElement("div");

    price.className = "stock-price";

    price.textContent =
        formatPrice(stock.latest_price);


    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-button";

    deleteButton.textContent = "Delete";

    deleteButton.setAttribute(
        "aria-label",
        `Delete ${stock.symbol} from watchlist`
    );


    deleteButton.addEventListener(
        "click",
        () => deleteStock(stock.symbol, deleteButton)
    );


    rightSide.appendChild(price);
    rightSide.appendChild(deleteButton);


    card.appendChild(stockInfo);
    card.appendChild(rightSide);


    return card;
}


/* =========================================================
   ADD STOCK
   ========================================================= */

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const symbol =
        symbolInput.value.trim().toUpperCase();


    if (!symbol) {

        showMessage(
            "Enter a ticker symbol.",
            "error"
        );

        return;
    }


    setAddButtonLoading(true);
    hideMessage();


    try {

        const response = await fetch("/watchlist", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                symbol: symbol
            })
        });


        const data = await response.json()
            .catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "Unable to add stock."
            );
        }


        symbolInput.value = "";


        showMessage(
            `${symbol} added to your watchlist.`,
            "success"
        );


        await loadWatchlist();


    } catch (error) {

        console.error("Add stock error:", error);

        showMessage(
            error.message ||
            "Unable to add stock.",
            "error"
        );

    } finally {

        setAddButtonLoading(false);
    }
});


/* =========================================================
   DELETE STOCK
   ========================================================= */

async function deleteStock(symbol, button) {

    const confirmed =
        window.confirm(
            `Remove ${symbol} from your watchlist?`
        );


    if (!confirmed) {
        return;
    }


    button.disabled = true;

    button.textContent = "Deleting...";


    try {

        const response = await fetch(
            `/watchlist/${encodeURIComponent(symbol)}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json()
            .catch(() => ({}));


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                `Unable to delete ${symbol}.`
            );
        }


        showMessage(
            `${symbol} removed from your watchlist.`,
            "success"
        );


        await loadWatchlist();


    } catch (error) {

        console.error(
            "Delete stock error:",
            error
        );


        showMessage(
            error.message ||
            `Unable to delete ${symbol}.`,
            "error"
        );


        button.disabled = false;

        button.textContent = "Delete";
    }
}


/* =========================================================
   REFRESH
   ========================================================= */

refreshButton.addEventListener(
    "click",
    async () => {

        refreshButton.disabled = true;

        refreshButton.textContent = "↻";

        await checkHealth();

        await loadWatchlist();

        refreshButton.disabled = false;
    }
);


/* =========================================================
   FORMATTING
   ========================================================= */

function formatPrice(price) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {
        return "—";
    }


    const numericPrice =
        Number(price);


    if (Number.isNaN(numericPrice)) {
        return "—";
    }


    return numericPrice.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    );
}


function formatUpdatedTime(timestamp) {

    if (!timestamp) {
        return "No update time";
    }


    const date =
        new Date(timestamp);


    if (Number.isNaN(date.getTime())) {
        return "Recently updated";
    }


    return `Updated ${date.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        }
    )}`;
}


/* =========================================================
   UI HELPERS
   ========================================================= */

function showLoading(show) {

    if (show) {

        loadingState.classList.remove("hidden");

        watchlistContainer.classList.add("hidden");

        emptyState.classList.add("hidden");

    } else {

        loadingState.classList.add("hidden");

        watchlistContainer.classList.remove("hidden");
    }
}


function showMessage(text, type) {

    message.textContent = text;

    message.className =
        `message ${type}`;

}


function hideMessage() {

    message.textContent = "";

    message.className =
        "message hidden";
}


function setAddButtonLoading(loading) {

    addButton.disabled = loading;

    if (loading) {

        addButton.innerHTML =
            "Adding...";

    } else {

        addButton.innerHTML =
            '<span class="button-icon">+</span> Add';
    }
}
