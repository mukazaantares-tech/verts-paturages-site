// ===============================
// CORE SYSTEM - VERTS-PATURAGES
// ===============================

const Core = {

    // -------- STORAGE --------
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            console.warn("Erreur lecture storage :", key);
            return [];
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    add(key, item) {
        const data = this.get(key);
        item.id = Date.now() + Math.random();
        data.push(item);
        this.set(key, data);
        return item;
    },

    update(key, id, newData) {
        const data = this.get(key).map(item =>
            item.id === id ? { ...item, ...newData } : item
        );
        this.set(key, data);
    },

    remove(key, id) {
        const data = this.get(key).filter(item => item.id !== id);
        this.set(key, data);
    },

    clear(key) {
        localStorage.removeItem(key);
    },

    // -------- ALERTS --------
    notify(message, type = "success") {
        const alert = document.createElement("div");
        alert.className = `core-alert ${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.classList.add("show");
        }, 50);

        setTimeout(() => {
            alert.classList.remove("show");
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    }

};
