// Helper function to process image modules
const processImageModules = (modules) => {
    const images = {};
    for (const path in modules) {
        const key = path.split('/').pop().replace('.svg', '');
        images[key] = modules[path].default;
    }
    return images;
};

// Import all image categories
const imageCategories = {
    cmts: import.meta.glob('/src/assets/menu_assets/drink_assets/CMTS/*.svg', { eager: true }),
    fft: import.meta.glob('/src/assets/menu_assets/drink_assets/FFT/*.svg', { eager: true }),
    fmt: import.meta.glob('/src/assets/menu_assets/drink_assets/FMT/*.svg', { eager: true }),
    ms: import.meta.glob('/src/assets/menu_assets/drink_assets/MS/*.svg', { eager: true }),
    pt: import.meta.glob('/src/assets/menu_assets/drink_assets/PT/*.svg', { eager: true }),
    social: import.meta.glob('/src/assets/svg/social/*.svg', { eager: true }),
    rewards: import.meta.glob('/src/assets/rewards/*.svg', { eager: true }),
};

// Process and merge all images
const images = Object.values(imageCategories).reduce((acc, modules) => ({
    ...acc,
    ...processImageModules(modules)
}), {});

export default images;