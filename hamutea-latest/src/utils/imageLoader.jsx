// CMTS
const cmtsModules = import.meta.glob('/src/assets/menu_assets/drink_assets/CMTS/*.svg', { eager: true });
const cmtsImages = {};
for (const path in cmtsModules) {
    const key = path.split('/').pop().replace('.svg', '');
    cmtsImages[key] = cmtsModules[path].default;
}

// FFT
const fftModules = import.meta.glob('/src/assets/menu_assets/drink_assets/FFT/*.svg', { eager: true });
const fftImages = {};
for (const path in fftModules) {
    const key = path.split('/').pop().replace('.svg', '');
    fftImages[key] = fftModules[path].default;
}

// FMT
const fmtModules = import.meta.glob('/src/assets/menu_assets/drink_assets/FMT/*.svg', { eager: true });
const fmtImages = {};
for (const path in fmtModules) {
    const key = path.split('/').pop().replace('.svg', '');
    fmtImages[key] = fmtModules[path].default;
}

// MS
const msModules = import.meta.glob('/src/assets/menu_assets/drink_assets/MS/*.svg', { eager: true });
const msImages = {};
for (const path in msModules) {
    const key = path.split('/').pop().replace('.svg', '');
    msImages[key] = msModules[path].default;
}

// PT
const ptModules = import.meta.glob('/src/assets/menu_assets/drink_assets/PT/*.svg', { eager: true });
const ptImages = {};
for (const path in ptModules) {
    const key = path.split('/').pop().replace('.svg', '');
    ptImages[key] = ptModules[path].default;
}


const socialMedia = import.meta.glob('/src/assets/svg/social/*.svg', { eager: true });
const socialMediaImages = {};
for (const path in socialMedia) {
    const key = path.split('/').pop().replace('.svg', '');
    socialMediaImages[key] = socialMedia[path].default;
}

const stepsModules = import.meta.glob('/src/assets/rewards/*.svg', { eager: true });
const stepsImages = {};
for (const path in stepsModules) {
    const key = path.split('/').pop().replace('.svg', '');
    stepsImages[key] = stepsModules[path].default;
}


// Merge all into one
const images = {
    ...cmtsImages,
    ...fftImages,
    ...fmtImages,
    ...msImages,
    ...ptImages,
    ...socialMediaImages,
    ...stepsImages
};

export default images;
