# Inventory image assets

Inventory vehicle images are bundled from `src/assets/` through the explicit imports in `src/features/inventory/data/carImages.js`.

That module is the source of truth for card images and detail galleries. Each gallery starts with its card image and includes only additional supplied images; available files do not provide dedicated side, rear, or interior views for every vehicle. Some vehicles therefore use a reused or related image as recorded in the approved mapping.

Do not use public-root paths for vehicle images. Add supplied image imports and update the corresponding car entry in `carImages.js` instead.
