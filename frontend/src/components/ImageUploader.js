import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import Resizer from 'react-image-file-resizer';

const ImageUploader = ({ imagePreview, onImageChange, onImageRemove, width = 800, height = 600, quality = 80, previewHeight = 200 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localPreview, setLocalPreview] = useState(imagePreview);
  const fileInputRef = useRef(null);
  
  // Update local preview when prop changes
  useEffect(() => {
    setLocalPreview(imagePreview);
  }, [imagePreview]);

  const handleImageUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      try {
        Resizer.imageFileResizer(
          file,
          width,
          height,
          'JPEG',
          quality,
          0,
          (uri) => {
            resolve(uri);
          },
          'base64',
          width / 2,
          height / 2
        );
      } catch (err) {
        console.error('Error resizing image:', err);
        reject(err);
      }
    });
  };

  const handleImageSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Create a preview URL immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      
      // Process the image asynchronously to avoid blocking UI
      setTimeout(async () => {
        try {
          const resizedImage = await resizeImage(file);
          
          // Only revoke the object URL after we have the resized image
          // to prevent the preview from disappearing
          onImageChange({
            preview: resizedImage,
            file: resizedImage
          });
          
          // Now it's safe to revoke since we're using the resized image
          URL.revokeObjectURL(previewUrl);
        } catch (err) {
          console.error('Error processing image:', err);
          setError('Failed to process image. Please try again.');
          // Keep the preview URL in case of error
          onImageChange({
            preview: previewUrl,
            file: file
          });
        } finally {
          setIsLoading(false);
        }
      }, 100);
    } catch (err) {
      console.error('Error handling image:', err);
      setError('Failed to upload image. Please try again.');
      setIsLoading(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleRemoveImage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setLocalPreview(null);
    onImageRemove();
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelected}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      
      {localPreview ? (
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Box
            component="img"
            src={localPreview}
            alt="Event preview"
            sx={{
              width: '100%',
              height: previewHeight,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 1
            }}
            onError={(e) => {
              console.error('Image failed to load');
              setError('Failed to load image preview');
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Preview';
            }}
          />
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      ) : (
        <Box
          onClick={handleImageUpload}
          sx={{
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            mb: 2,
            height: previewHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'rgba(255, 255, 255, 0.5)', mb: 2 }} />
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Click or drag to upload an image
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
            Recommended size: {width}x{height}px
          </Typography>
        </Box>
      )}
      
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleImageUpload}
          startIcon={<CloudUpload />}
          disabled={isLoading}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          {localPreview ? 'Change Image' : 'Upload Image'}
        </Button>
      </Box>
    </Box>
  );
};

export default ImageUploader; 