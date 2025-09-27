# Image Optimization Script

# This script helps compress your vehicle images for better web performance
# Run this in your project root directory

# Install ImageMagick (if not already installed)
# Windows: choco install imagemagick
# macOS: brew install imagemagick  
# Ubuntu: sudo apt-get install imagemagick

# Compress all vehicle images to 80% quality and resize to max 1200px width
echo "Compressing vehicle images for web optimization..."

# Create optimized directory
mkdir -p public/vehicles-optimized

# Compress images while maintaining quality
for dir in public/vehicles/*/; do
    dir_name=$(basename "$dir")
    mkdir -p "public/vehicles-optimized/$dir_name"
    
    echo "Processing $dir_name..."
    
    for img in "$dir"*.jpg; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            # Resize to max 1200px width, compress to 80% quality
            convert "$img" -resize "1200x1200>" -quality 80 -strip "public/vehicles-optimized/$dir_name/$filename"
            echo "  Optimized: $filename"
        fi
    done
done

echo "Image optimization complete!"
echo "Original size: $(du -sh public/vehicles | cut -f1)"
echo "Optimized size: $(du -sh public/vehicles-optimized | cut -f1)"
echo ""
echo "To use optimized images:"
echo "1. Backup your original images: mv public/vehicles public/vehicles-backup"
echo "2. Use optimized images: mv public/vehicles-optimized public/vehicles"