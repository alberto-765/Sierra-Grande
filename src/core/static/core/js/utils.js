"use strict";

/**
 * Generate a randomo color based on the name of the user
 * @param {string} name Name of the user
 */
const getNameColor = (name) => {
    let hash = 0;
    // Genera el hash, números para el color
    for (const i in name) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Create the color based on the hash
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF; // Convierte el hash en un color hexadecimal
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color; // Format #RRGGBB
};
