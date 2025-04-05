import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  CalendarToday,
  LocationOn,
  AccessTime,
  Category as CategoryIcon,
  Group,
  AccountBalance,
  Public as PublishIcon,
  Assessment as StatsIcon,
  Delete,
  Add,
  Edit,
  Category,
  AttachMoney,
  Image,
  Person,
  CloudUpload,
  Instagram,
  Facebook,
  YouTube,
  Twitter,
  MusicNote,
  Star
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useUser, useSession } from '@clerk/clerk-react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Resizer from 'react-image-file-resizer';
import ImageUploader from '../ImageUploader';
import ArtistImageUploader from '../ArtistImageUploader';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiFormHelperText-root': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(to bottom right, rgba(25, 118, 210, 0.05), rgba(66, 165, 245, 0.05))',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: theme.spacing(2),
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontSize: '1.75rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(3, 0),
}));

const FormSection = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '12px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(255, 255, 255, 0.05)',
  '& .section-title': {
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
}));

const EventDialog = ({ open, onClose, event = null, onEventSaved, fetchEvents }) => {
  const { user } = useUser();
  const { session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const formInitializedRef = useRef(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);
  const artistImageInputRefs = useRef({});
  
  // Track if form has been touched to avoid unnecessary resets
  const formTouchedRef = useRef(false);
  // Store form data in a ref to prevent loss during re-renders
  const formDataRef = useRef(null);
  
  // Define getInitialFormData before it's used
  const getInitialFormData = useCallback((eventData = null) => {
    if (eventData) {
      // Ensure proper social media structure for each artist
      const formattedArtists = eventData.artists?.map(artist => ({
        name: artist.name || '',
        genre: artist.genre || '',
        description: artist.description || artist.bio || '',
        image: artist.image || '',
        social: {
          instagram: artist.social?.instagram || artist.socialMedia?.instagram || '',
          facebook: artist.social?.facebook || artist.socialMedia?.facebook || '',
          youtube: artist.social?.youtube || artist.socialMedia?.youtube || '',
          twitter: artist.social?.twitter || artist.socialMedia?.twitter || ''
        },
        popularSongs: artist.upcomingPerformances?.map(performance => performance.song) || [''],
        achievements: artist.achievements?.map(achievement => achievement.description) || ['']
      })) || [{
        name: '',
        genre: '',
        description: '',
        image: '',
        social: {
          instagram: '',
          facebook: '',
          youtube: '',
          twitter: ''
        },
        popularSongs: [''],
        achievements: ['']
      }];

      const initialData = {
        title: eventData.title || '',
        description: eventData.description || '',
        date: eventData.date ? dayjs(eventData.date) : dayjs(),
        time: eventData.time || '18:00',
        category: eventData.category || eventData.genre || 'POP',
        status: eventData.status || 'DRAFT',
        image: eventData.image || '',
        artists: formattedArtists,
        venue: {
          name: eventData.venue?.name || '',
          address: {
            street: eventData.venue?.address?.street || '',
            city: eventData.venue?.address?.city || '',
            state: eventData.venue?.address?.state || '',
            zipCode: eventData.venue?.address?.zipCode || ''
          },
          capacity: eventData.venue?.capacity || '',
          facilities: eventData.venue?.facilities || [],
          mapLocation: eventData.venue?.mapLocation || { latitude: '', longitude: '' }
        },
        ticketTypes: eventData.ticketTypes?.length ? eventData.ticketTypes : [{
          name: 'General Admission',
          price: '',
          quantity: '',
          description: '',
          benefits: ['Entry to event']
        }],
      };
      
      // Set image preview if there's an image
      if (eventData.image) {
        setImagePreview(eventData.image);
      }
      
      return initialData;
    } else {
      // Default empty form
      return {
        title: '',
        description: '',
        date: dayjs(),
        time: '18:00',
        category: 'POP',
        status: 'DRAFT',
        image: '',
        artists: [{
          name: '',
          genre: '',
          description: '',
          image: '',
          social: {
            instagram: '',
            facebook: '',
            youtube: '',
            twitter: ''
          },
          popularSongs: [''],
          achievements: ['']
        }],
        venue: {
          name: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          capacity: '',
          facilities: [],
          mapLocation: {
            latitude: '',
            longitude: ''
          }
        },
        ticketTypes: [{
          name: 'General Admission',
          price: '',
          quantity: '',
          description: '',
          benefits: ['Entry to event']
        }]
      };
    }
  }, []);
  
  // Initialize form state with the getInitialFormData function
  const [formData, setFormData] = useState(() => {
    const initialData = getInitialFormData(event);
    formDataRef.current = initialData;
    return initialData;
  });

  // Initialize form data when dialog opens
  useEffect(() => {
    console.log("Dialog open state changed:", open);
    
    if (open) {
      // Only reset form if not already touched or different event
      if (!formTouchedRef.current || (event && event._id !== formData?._id)) {
        console.log("Initializing form data with event:", event);
        const initialData = getInitialFormData(event);
        setFormData(initialData);
        formDataRef.current = initialData;
        setImagePreview(event?.image || null);
        
        // For new event creation, mark as touched immediately to prevent reset during editing
        formTouchedRef.current = true;
      } else {
        console.log("Form already touched, preserving state");
        // Restore form data from ref if available
        if (formDataRef.current) {
          setFormData(formDataRef.current);
        }
      }
    }
    // Don't reset touch state when dialog closes to prevent form reset
  }, [open, event, getInitialFormData]);

  // Handle image change from ImageUploader
  const handleImageChange = useCallback(({ preview, file }) => {
    console.log("Image changed:", { hasPreview: !!preview, hasFile: !!file });
    formTouchedRef.current = true;
    
    // Store the preview URL
    setImagePreview(preview);
    
    // Always update formDataRef directly to ensure we don't lose the image
    if (formDataRef.current) {
      formDataRef.current = {
        ...formDataRef.current,
        image: file || preview // Use file if available, otherwise use preview
      };
    }
    
    // Then update the state
    setFormData(prev => {
      const updatedForm = {
        ...prev,
        image: file || preview // Use file if available, otherwise use preview
      };
      console.log("Form data updated with image");
      return updatedForm;
    });
  }, []);

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    console.log("Removing image");
    setImagePreview(null);
    
    // Update formDataRef directly
    if (formDataRef.current) {
      formDataRef.current = {
        ...formDataRef.current,
        image: ''
      };
    }
    
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
  }, []);

  // Handle artist image change
  const handleArtistImageChange = useCallback((artistIndex, { preview, file }) => {
    console.log(`Artist image changed for index ${artistIndex}:`, { hasPreview: !!preview, hasFile: !!file });
    formTouchedRef.current = true;
    
    // Update formDataRef directly
    if (formDataRef.current) {
      const newArtists = [...formDataRef.current.artists];
      const updatedArtist = {
        ...newArtists[artistIndex],
        imagePreview: preview,
        image: file || preview // Use file if available, otherwise use preview
      };
      newArtists[artistIndex] = updatedArtist;
      
      formDataRef.current = {
        ...formDataRef.current,
        artists: newArtists
      };
    }
    
    // Then update the state
    setFormData(prev => {
      const newArtists = [...prev.artists];
      const updatedArtist = {
        ...newArtists[artistIndex],
        imagePreview: preview,
        image: file || preview // Use file if available, otherwise use preview
      };
      newArtists[artistIndex] = updatedArtist;
      return {...prev, artists: newArtists};
    });
  }, []);

  // Handle artist image removal
  const handleArtistImageRemove = useCallback((artistIndex) => {
    console.log(`Removing artist image for index ${artistIndex}`);
    
    // Update formDataRef directly
    if (formDataRef.current) {
      const newArtists = [...formDataRef.current.artists];
      const updatedArtist = {
        ...newArtists[artistIndex],
        image: '',
        imagePreview: undefined
      };
      newArtists[artistIndex] = updatedArtist;
      
      formDataRef.current = {
        ...formDataRef.current,
        artists: newArtists
      };
    }
    
    setFormData(prev => {
      const newArtists = [...prev.artists];
      const updatedArtist = {
        ...newArtists[artistIndex],
        image: '',
        imagePreview: undefined
      };
      newArtists[artistIndex] = updatedArtist;
      return {...prev, artists: newArtists};
    });
  }, []);

  // Handle artist field changes
  const handleArtistChange = useCallback((artistIndex, field, value) => {
    console.log(`Artist field ${field} changed for index ${artistIndex}`);
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newArtists = [...prev.artists];
      const artist = {...newArtists[artistIndex]};
      
      // Handle nested fields like social.instagram
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        artist[parentField] = {
          ...artist[parentField],
          [childField]: value
        };
      } else {
        artist[field] = value;
      }
      
      newArtists[artistIndex] = artist;
      
      const updatedForm = {
        ...prev,
        artists: newArtists
      };
      
      // Update formDataRef
      if (formDataRef.current) {
        const refArtists = [...formDataRef.current.artists];
        const refArtist = {...refArtists[artistIndex]};
        
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          refArtist[parentField] = {
            ...refArtist[parentField],
            [childField]: value
          };
        } else {
          refArtist[field] = value;
        }
        
        refArtists[artistIndex] = refArtist;
        
        formDataRef.current = {
          ...formDataRef.current,
          artists: refArtists
        };
      }
      
      return updatedForm;
    });
  }, []);

  // Handle ticket field changes
  const handleTicketChange = useCallback((ticketIndex, field, value) => {
    console.log(`Ticket field ${field} changed for index ${ticketIndex}`);
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newTickets = [...prev.ticketTypes];
      const ticket = {...newTickets[ticketIndex]};
      
      ticket[field] = value;
      newTickets[ticketIndex] = ticket;
      
      const updatedForm = {
        ...prev,
        ticketTypes: newTickets
      };
      
      // Update formDataRef
      if (formDataRef.current) {
        const refTickets = [...formDataRef.current.ticketTypes];
        const refTicket = {...refTickets[ticketIndex]};
        
        refTicket[field] = value;
        refTickets[ticketIndex] = refTicket;
        
        formDataRef.current = {
          ...formDataRef.current,
          ticketTypes: refTickets
        };
      }
      
      return updatedForm;
    });
  }, []);

  // Update other form change handlers to use formDataRef
  const handleNestedFormChange = useCallback((parentField, childPath, value) => {
    console.log(`Nested field updated: ${parentField}.${childPath}`);
    formInitializedRef.current = true;
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const parentCopy = {...prev[parentField]};
      
      // Handle array paths like 'artists[0].name'
      if (childPath.includes('[')) {
        const matches = childPath.match(/(\w+)\[(\d+)\]\.?(\w+)?\.?(\w+)?/);
        if (matches) {
          const [_, arrayName, index, property, subProperty] = matches;
          const indexNum = parseInt(index);
          
          if (arrayName === parentField) {
            // Direct array in parent - e.g., 'artists[0].name'
            if (property && !subProperty) {
              parentCopy[indexNum] = {
                ...parentCopy[indexNum],
                [property]: value
              };
            } else if (property && subProperty) {
              // Nested property - e.g., 'artists[0].social.instagram'
              parentCopy[indexNum] = {
                ...parentCopy[indexNum],
                [property]: {
                  ...parentCopy[indexNum][property],
                  [subProperty]: value
                }
              };
            }
          }
        }
      } else if (childPath.includes('.')) {
        // Handle nested objects like 'venue.address.city'
        const parts = childPath.split('.');
        let current = parentCopy;
        
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]] = {...current[parts[i]]};
        }
        
        current[parts[parts.length - 1]] = value;
      } else {
        // Simple property - e.g., 'name'
        parentCopy[childPath] = value;
      }
      
      const updatedForm = {
        ...prev,
        [parentField]: parentCopy
      };
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);

  // Handle form changes and update the ref
  const handleFormChange = useCallback((field, value) => {
    console.log(`Field updated: ${field}`);
    formInitializedRef.current = true;
    formTouchedRef.current = true;
    
    setFormData(prev => {
      let updatedForm = { ...prev };
      
      // Handle nested fields like venue.name
      if (field.includes('.')) {
        const parts = field.split('.');
        let current = updatedForm;
        
        // Navigate to the nested object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) {
            current[parts[i]] = {};
          }
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        
        // Set the value at the final property
        current[parts[parts.length - 1]] = value;
      } else {
        // Simple property
        updatedForm[field] = value;
      }
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);

  const handleClose = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError(null);
    setIsSubmitting(false);
    formInitializedRef.current = false;
    setImagePreview(null);
    onClose();
  }, [onClose]);

  // Add a new artist to the form
  const addArtist = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const newArtist = {
      name: '',
      genre: '',
      description: '',
      image: '',
      social: {
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: ''
      },
      popularSongs: [''],
      achievements: ['']
    };
    
    setFormData(prev => {
      const updatedForm = {
        ...prev,
        artists: [...prev.artists, newArtist]
      };
      
      // Update formDataRef
      if (formDataRef.current) {
        formDataRef.current = {
          ...formDataRef.current,
          artists: [...formDataRef.current.artists, newArtist]
        };
      }
      
      return updatedForm;
    });
  }, []);

  const removeArtist = useCallback((index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newArtists = [...prev.artists];
      newArtists.splice(index, 1);
      const updatedForm = {
        ...prev,
        artists: newArtists
      };
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);

  const addTicketType = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const updatedForm = {
        ...prev,
        ticketTypes: [
          ...prev.ticketTypes,
          {
          name: '',
          price: '',
          quantity: '',
          description: '',
          benefits: ['Entry to event']
          }
        ]
      };
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);

  const removeTicketType = useCallback((index, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newTicketTypes = [...prev.ticketTypes];
      newTicketTypes.splice(index, 1);
      const updatedForm = {
        ...prev,
        ticketTypes: newTicketTypes
      };
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);
  
  // Helper for handling artist array fields like popularSongs and achievements
  const handleArtistArrayField = useCallback((artistIndex, fieldName, itemIndex, value, action) => {
    console.log(`Artist array field ${fieldName} action ${action} for artist ${artistIndex}`);
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newArtists = [...prev.artists];
      const artist = {...newArtists[artistIndex]};
      
      // Initialize the array if it doesn't exist
      if (!artist[fieldName] || !Array.isArray(artist[fieldName])) {
        artist[fieldName] = [];
      }
      
      const fieldArray = [...artist[fieldName]];
      
      switch (action) {
        case 'add':
          fieldArray.push('');
          break;
        case 'remove':
          fieldArray.splice(itemIndex, 1);
          break;
        case 'update':
          fieldArray[itemIndex] = value;
          break;
        default:
          break;
      }
      
      artist[fieldName] = fieldArray;
      newArtists[artistIndex] = artist;
      
      // Update formDataRef
      if (formDataRef.current) {
        const refArtists = [...formDataRef.current.artists];
        const refArtist = {...refArtists[artistIndex]};
        
        if (!refArtist[fieldName] || !Array.isArray(refArtist[fieldName])) {
          refArtist[fieldName] = [];
        }
        
        refArtist[fieldName] = fieldArray;
        refArtists[artistIndex] = refArtist;
        
        formDataRef.current = {
          ...formDataRef.current,
          artists: refArtists
        };
      }
      
      return {...prev, artists: newArtists};
    });
  }, []);

  // Helper for handling ticket array fields like benefits
  const handleTicketArrayField = useCallback((ticketIndex, fieldName, itemIndex, value, operation) => {
    formTouchedRef.current = true;
    
    setFormData(prev => {
      const newTickets = [...prev.ticketTypes];
      const ticket = {...newTickets[ticketIndex]};
      
      if (operation === 'add') {
        ticket[fieldName] = [...ticket[fieldName], value];
      } else if (operation === 'remove') {
        const newArray = [...ticket[fieldName]];
        newArray.splice(itemIndex, 1);
        ticket[fieldName] = newArray;
      } else if (operation === 'update') {
        const newArray = [...ticket[fieldName]];
        newArray[itemIndex] = value;
        ticket[fieldName] = newArray;
      }
      
      newTickets[ticketIndex] = ticket;
      
      const updatedForm = {
        ...prev,
        ticketTypes: newTickets
      };
      
      // Store updated form data in ref
      formDataRef.current = updatedForm;
      return updatedForm;
    });
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log("Already submitting, skipping");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Use formDataRef.current to ensure we have the latest data
      const currentFormData = formDataRef.current || formData;
      
      console.log("Submitting form data:", {
        title: currentFormData.title,
        hasImage: !!currentFormData.image,
        imageLength: currentFormData.image ? (typeof currentFormData.image === 'string' ? currentFormData.image.length : 'object') : 0,
        date: currentFormData.date
      });
      
      // Basic validation
      if (!currentFormData.title || !currentFormData.description || !currentFormData.date || !currentFormData.venue.name || !currentFormData.artists[0].name) {
        console.error("Missing required fields");
        setError("Please fill in all required fields: title, description, date, venue and at least one artist");
        setIsSubmitting(false);
        return;
      }
      
      // Determine status based on date
      const eventDate = new Date(currentFormData.date);
      const currentDate = new Date();
      let status;
      
      if (eventDate < currentDate) {
        status = "COMPLETED";
      } else if (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      ) {
        status = "RUNNING";
      } else {
        status = "PUBLISHED"; // Changed from "UPCOMING" to "PUBLISHED"
      }
      
      // Calculate price and capacity
      const totalCapacity = currentFormData.ticketTypes.reduce((total, ticket) => 
        total + (parseInt(ticket.quantity) || 0), 0);
      
      const prices = currentFormData.ticketTypes
        .map(ticket => parseFloat(ticket.price) || 0)
        .filter(price => price > 0);
      
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      
      // Create a deep copy of the form data to avoid modifying the original
      const eventData = JSON.parse(JSON.stringify({
        ...currentFormData,
        status,
        price: minPrice,
        capacity: totalCapacity,
        availableTickets: totalCapacity
      }));
      
      // Ensure image is included in the request
      console.log("Image data being sent:", {
        hasImage: !!eventData.image,
        imageLength: eventData.image ? (typeof eventData.image === 'string' ? eventData.image.length : 'object') : 0,
        imageType: eventData.image ? (typeof eventData.image === 'string' && eventData.image.startsWith('data:image') ? 'base64' : 'url/other') : 'none'
      });
      
      // Get token for authentication
      const token = await session.getToken();
      if (!token) {
        console.error("No authentication token found");
        setError("You must be logged in to create or edit events");
        setIsSubmitting(false);
        return;
      }
      
      // Determine if this is a new event or an update
      const isNewEvent = !event?._id;
      const url = isNewEvent
        ? '/api/events'
        : `/api/events/${event._id}`;
      const method = isNewEvent ? 'POST' : 'PUT';
      
      console.log(`Making ${method} request to ${url}`);
      
      // Make the API request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-Email': user.primaryEmailAddress.emailAddress
        },
        body: JSON.stringify(eventData)
      });

      // Handle errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", response.status, errorData);
        setError(errorData.message || `Failed to ${isNewEvent ? 'create' : 'update'} event. Please try again.`);
        setIsSubmitting(false);
        return;
      }
      
      // Success
      const savedEvent = await response.json();
      console.log(`Event ${isNewEvent ? 'created' : 'updated'} successfully:`, savedEvent._id, savedEvent.title);
      
      // Show success message and close dialog
      setIsSubmitting(false);
      onEventSaved(savedEvent);
      
      // Set success message
      setSuccess(`Event ${isNewEvent ? 'created' : 'updated'} successfully!`);
      
      // Update events list if needed
      if (fetchEvents) {
        fetchEvents();
      }
      
      // Close the dialog
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(`An unexpected error occurred: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  // Memoize the event dialog component to prevent unnecessary re-renders
  const eventDialog = useMemo(() => (
    <StyledDialog
      open={open}
      onClose={(e, reason) => {
        // Only close if it's not a backdrop click or escape key
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose(e);
        }
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      // Prevent dialog from closing on backdrop click
      disableBackdropClick
    >
      <StyledDialogTitle>
        {event ? 'Edit Event' : 'Create New Event'}
      </StyledDialogTitle>
      <DialogContent>
        <FormSection>
          <Typography variant="h6" className="section-title">
            <Image fontSize="small" /> Event Image
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ImageUploader
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                width={800}
                height={600}
                quality={80}
                previewHeight={300}
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection>
          <Typography variant="h6" className="section-title">
            <Category fontSize="small" /> Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                required
                label="Event Name"
                fullWidth
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter a captivating title for your event"
                helperText="Make it memorable and descriptive"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                required
                label="Event Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Describe your event in detail"
                helperText="Include key highlights and what attendees can expect"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Genre</InputLabel>
                <StyledSelect
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="ROCK">🎸 Rock</MenuItem>
                  <MenuItem value="POP">🎵 Pop</MenuItem>
                  <MenuItem value="JAZZ">🎷 Jazz</MenuItem>
                  <MenuItem value="CLASSICAL">🎻 Classical</MenuItem>
                  <MenuItem value="FOLK">🪕 Folk</MenuItem>
                  <MenuItem value="ELECTRONIC">🎹 Electronic</MenuItem>
                  <MenuItem value="HIP_HOP">🎤 Hip Hop</MenuItem>
                  <MenuItem value="OTHER">✨ Other</MenuItem>
                </StyledSelect>
              </FormControl>
            </Grid>
          </Grid>
        </FormSection>

        <FormSection>
          <Typography variant="h6" className="section-title">
            <CalendarToday fontSize="small" /> Date & Venue
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Event Date"
                value={formData.date}
                onChange={(newValue) => handleFormChange('date', newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    helperText: "Select the date of your event",
                    variant: "outlined",
                    InputLabelProps: { shrink: true },
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'rgba(255, 255, 255, 0.9)',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                label="Time"
                type="time"
                fullWidth
                value={formData.time}
                onChange={(e) => handleFormChange('time', e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Choose the start time"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                required
                label="Venue Name"
                fullWidth
                value={formData.venue.name}
                onChange={(e) => handleFormChange('venue.name', e.target.value)}
                placeholder="Enter the venue name"
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                required
                label="Street Address"
                fullWidth
                value={formData.venue.address.street}
                onChange={(e) => handleFormChange('venue.address.street', e.target.value)}
                placeholder="Enter the street address"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                required
                label="City"
                fullWidth
                value={formData.venue.address.city}
                onChange={(e) => handleFormChange('venue.address.city', e.target.value)}
                placeholder="Enter the city"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Venue Capacity"
                type="number"
                fullWidth
                value={formData.venue.capacity}
                onChange={(e) => handleFormChange('venue.capacity', e.target.value)}
                placeholder="Enter venue capacity"
              />
            </Grid>
          </Grid>
        </FormSection>

        <FormSection>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" className="section-title">
              <Person fontSize="small" /> Artists
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={addArtist}
              variant="outlined"
              size="small"
            >
              Add Artist
            </Button>
          </Box>
          {formData.artists.map((artist, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Artist {index + 1}</Typography>
                {index > 0 && (
                  <IconButton size="small" onClick={(e) => removeArtist(index, e)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    required
                    label="Artist Name"
                    fullWidth
                    value={artist.name}
                    onChange={(e) => handleArtistChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Genre"
                    fullWidth
                    value={artist.genre}
                    onChange={(e) => handleArtistChange(index, 'genre', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Artist Description/Bio"
                    fullWidth
                    multiline
                    rows={3}
                    value={artist.description}
                    onChange={(e) => handleArtistChange(index, 'description', e.target.value)}
                    placeholder="Provide a detailed biography of the artist"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ArtistImageUploader
                    imagePreview={artist.imagePreview}
                    onImageChange={(imageData) => handleArtistImageChange(index, imageData)}
                    onImageRemove={() => handleArtistImageRemove(index)}
                    artistName={artist.name || `Artist ${index + 1}`}
                  />
                </Grid>
                
                {/* Social Media Links */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Social Media</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Instagram"
                        value={artist.social?.instagram || ''}
                        onChange={(e) => handleArtistChange(index, 'social.instagram', e.target.value)}
                        InputProps={{
                          startAdornment: <Instagram fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
                        }}
                        placeholder="Instagram handle or URL"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Facebook"
                        value={artist.social?.facebook || ''}
                        onChange={(e) => handleArtistChange(index, 'social.facebook', e.target.value)}
                        InputProps={{
                          startAdornment: <Facebook fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
                        }}
                        placeholder="Facebook page URL"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="YouTube"
                        value={artist.social?.youtube || ''}
                        onChange={(e) => handleArtistChange(index, 'social.youtube', e.target.value)}
                        InputProps={{
                          startAdornment: <YouTube fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
                        }}
                        placeholder="YouTube channel URL"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Twitter"
                        value={artist.social?.twitter || ''}
                        onChange={(e) => handleArtistChange(index, 'social.twitter', e.target.value)}
                        InputProps={{
                          startAdornment: <Twitter fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
                        }}
                        placeholder="Twitter handle or URL"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* Popular Songs */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Popular Songs</Typography>
                  {artist.popularSongs.map((song, songIndex) => (
                    <Box key={songIndex} sx={{ display: 'flex', mt: 1 }}>
                      <StyledTextField
                        fullWidth
                        value={song}
                        onChange={(e) => handleArtistArrayField(index, 'popularSongs', songIndex, e.target.value, 'update')}
                        placeholder={`Song ${songIndex + 1}`}
                        InputProps={{
                          startAdornment: <MusicNote fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                          endAdornment: songIndex > 0 && (
                            <IconButton
                              size="small" 
                              color="error"
                              onClick={() => handleArtistArrayField(index, 'popularSongs', songIndex, '', 'remove')}
                              sx={{ ml: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )
                        }}
                      />
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    size="small"
                    onClick={() => handleArtistArrayField(index, 'popularSongs', '', '', 'add')}
                    sx={{ mt: 1 }}
                  >
                    Add Song
                  </Button>
                </Grid>
                
                {/* Achievements */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Achievements</Typography>
                  {artist.achievements.map((achievement, achievementIndex) => (
                    <Box key={achievementIndex} sx={{ display: 'flex', mt: 1 }}>
                      <StyledTextField
                        fullWidth
                        value={achievement}
                        onChange={(e) => handleArtistArrayField(index, 'achievements', achievementIndex, e.target.value, 'update')}
                        placeholder={`Achievement ${achievementIndex + 1}`}
                        InputProps={{
                          startAdornment: <Star fontSize="small" sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />,
                          endAdornment: achievementIndex > 0 && (
                            <IconButton
                              size="small" 
                              color="error"
                              onClick={() => handleArtistArrayField(index, 'achievements', achievementIndex, '', 'remove')}
                              sx={{ ml: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )
                        }}
                      />
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    size="small"
                    onClick={() => handleArtistArrayField(index, 'achievements', '', '', 'add')}
                    sx={{ mt: 1 }}
                  >
                    Add Achievement
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
        </FormSection>

        <FormSection>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" className="section-title">
              <AttachMoney fontSize="small" /> Ticket Types
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={addTicketType}
              variant="outlined"
              size="small"
            >
              Add Ticket Type
            </Button>
          </Box>
          {formData.ticketTypes.map((ticket, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Ticket Type {index + 1}</Typography>
                {index > 0 && (
                  <IconButton size="small" onClick={(e) => removeTicketType(index, e)} color="error">
                    <Delete />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    required
                    label="Ticket Name"
                    fullWidth
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    placeholder="e.g., VIP, General Admission"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    required
                    label="Price (NPR)"
                    type="number"
                    fullWidth
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    required
                    label="Quantity Available"
                    type="number"
                    fullWidth
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={2}
                    value={ticket.description}
                    onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                    placeholder="Describe what's included with this ticket type"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Benefits</Typography>
                  {ticket.benefits.map((benefit, benefitIndex) => (
                    <Box key={benefitIndex} sx={{ display: 'flex', mt: 1 }}>
                      <StyledTextField
                        fullWidth
                        value={benefit}
                        onChange={(e) => handleTicketArrayField(index, 'benefits', benefitIndex, e.target.value, 'update')}
                        placeholder={`Benefit ${benefitIndex + 1}`}
                        InputProps={{
                          endAdornment: benefitIndex > 0 && (
                            <IconButton
                              size="small" 
                              color="error"
                              onClick={(e) => handleTicketArrayField(index, 'benefits', benefitIndex, '', 'remove')}
                              sx={{ ml: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )
                        }}
                      />
                    </Box>
                  ))}
                  <Button
                    startIcon={<Add />}
                    size="small"
                    onClick={(e) => handleTicketArrayField(index, 'benefits', '', '', 'add')}
                    sx={{ mt: 1 }}
                  >
                    Add Benefit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
        </FormSection>
      </DialogContent>
      <DialogActions sx={{ padding: 3, justifyContent: 'center', gap: 2 }}>
        <Button 
          onClick={(e) => handleClose(e)}
          variant="outlined"
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            borderRadius: '8px',
            px: 4,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          type="button"
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            borderRadius: '8px',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
        </Button>
      </DialogActions>
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      {success && (
        <Box sx={{ p: 2 }}>
          <Alert severity="success">{success}</Alert>
        </Box>
      )}
    </StyledDialog>
  ), [
    open, 
    handleClose, 
    formData, 
    formDataRef.current,
    imagePreview, 
    handleFormChange, 
    handleArtistChange, 
    handleTicketChange, 
    handleTicketArrayField, 
    addArtist, 
    removeArtist, 
    addTicketType, 
    removeTicketType, 
    isSubmitting, 
    handleSubmit,
    handleImageChange,
    handleImageRemove,
    handleArtistImageChange,
    handleArtistImageRemove,
    error,
    success
  ]);

  return eventDialog;
};

const AdminDashboard = () => {
  const { user } = useUser();
  const { session } = useSession();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    time: '',
    category: 'POP',
    status: 'DRAFT',
    image: '',
    artists: [{
      name: '',
      genre: '',
      description: '',
      image: '',
      social: {
        instagram: '',
        facebook: '',
        youtube: '',
        twitter: ''
      },
      popularSongs: [''],
      achievements: ['']
    }],
    venue: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      capacity: '',
      facilities: [],
      mapLocation: {
        latitude: '',
        longitude: ''
      }
    },
    ticketTypes: [{
      name: 'General Admission',
      price: '',
      quantity: '',
      description: '',
      benefits: ['Entry to event']
    }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail || !session) {
        console.error('Authentication missing:', { hasUser: !!user, hasSession: !!session });
        throw new Error('User not authenticated');
      }

      const token = await session.getToken();
      if (!token) {
        console.error('Failed to get token');
        throw new Error('Authentication token missing');
      }

      console.log('Fetching events:', {
        userEmail,
        hasToken: !!token,
        tokenLength: token.length,
        url: '/api/events'
      });

      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Email': userEmail
        },
        credentials: 'include'
      });

      console.log('Events response:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch events:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched events:', {
        count: data.length,
        events: data.map(event => ({
          id: event._id,
          title: event.title,
          hasImage: !!event.image,
          imageLength: event.image ? (typeof event.image === 'string' ? event.image.length : 'object') : 0,
          imageType: event.image ? (typeof event.image === 'string' && event.image.startsWith('data:image') ? 'base64' : 'url/other') : 'none'
        }))
      });
      
      // Process the events to ensure image data is properly handled
      const processedEvents = data.map(event => {
        // Ensure image is properly formatted
        if (event.image && typeof event.image === 'string' && !event.image.startsWith('data:image') && !event.image.startsWith('http')) {
          // If it's a string but not a data URL or http URL, assume it's a base64 string without the prefix
          event.image = `data:image/jpeg;base64,${event.image}`;
        }
        
        // Process artist images
        if (event.artists && Array.isArray(event.artists)) {
          event.artists = event.artists.map(artist => {
            if (artist.image && typeof artist.image === 'string' && !artist.image.startsWith('data:image') && !artist.image.startsWith('http')) {
              artist.image = `data:image/jpeg;base64,${artist.image}`;
            }
            return artist;
          });
        }
        
        return event;
      });
      
      setEvents(processedEvents);

      // Calculate stats from events
      const eventStats = {
        PENDING: 0,
        APPROVED: 0,
        PUBLISHED: 0,
        REJECTED: 0
      };

      processedEvents.forEach(event => {
        if (event.status in eventStats) {
          eventStats[event.status]++;
        }
      });

      const organizers = new Set(processedEvents.map(event => event.organizer?._id)).size;

      setStats({
        totalEvents: processedEvents.length,
        eventStats: Object.entries(eventStats).map(([status, count]) => ({
          _id: status,
          count
        })),
        organizerCount: organizers
      });

      console.log('Updated stats:', {
        totalEvents: processedEvents.length,
        eventStats,
        organizerCount: organizers
      });

    } catch (error) {
      console.error('Error fetching events:', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [session, user]);

  // Add new useEffect to handle tab selection
  useEffect(() => {
    if (stats) {
      const pendingCount = getEventCount('PENDING');
      const approvedCount = getEventCount('APPROVED');
      
      // If there are no pending events but there are approved events, switch to approved tab
      if (pendingCount === 0 && approvedCount > 0 && selectedTab === 0) {
        setSelectedTab(1); // Switch to Approved tab
        console.log('Switching to Approved tab:', { pendingCount, approvedCount });
      }
    }
  }, [stats]);

  const handleStatusChange = async (eventId, newStatus) => {
    if (!user) return;

    try {
      setLoading(true);
      const token = await session.getToken();
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      console.log('Updating event status:', {
        eventId,
        newStatus,
        userEmail
      });

      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Email': userEmail,
          'X-User-Role': 'admin'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          feedback: feedback
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Failed to update event status:', errorData);
        throw new Error(errorData.message || `Failed to update event status: ${response.status}`);
      }

      const updatedEvent = await response.json();
      console.log('Event status updated successfully:', updatedEvent);
      
      // Update the event in the local state
      setEvents(events.map(event => 
        event._id === eventId ? updatedEvent : event
      ));
      
      // Refresh events to update counts
      await fetchEvents();
      
      setDialogOpen(false);
      setFeedback('');
      setSelectedEvent(null);
    } catch (err) {
      console.error('Error updating event status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (event, status) => {
    try {
      console.log('Handling action:', { eventId: event._id, status });
      await handleStatusChange(event._id, status);
    } catch (error) {
      console.error('Error in handleAction:', error);
      setError(error.message);
    }
  };

  const filteredEvents = events.filter(event => {
    console.log('Filtering event:', {
      eventTitle: event.title,
      eventStatus: event.status,
      selectedTab,
      willShow: (
        (selectedTab === 0 && event.status === 'PENDING') ||
        (selectedTab === 1 && event.status === 'APPROVED') ||
        (selectedTab === 2 && event.status === 'PUBLISHED') ||
        (selectedTab === 3 && event.status === 'REJECTED')
      )
    });

    switch (selectedTab) {
      case 0: return event.status === 'PENDING';
      case 1: return event.status === 'APPROVED';
      case 2: return event.status === 'PUBLISHED';
      case 3: return event.status === 'REJECTED';
      default: return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'APPROVED': return 'success';
      case 'PUBLISHED': return 'info';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const handleOpenDialog = useCallback((event = null) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedEvent(null);
    setOpenDialog(false);
    // Add a small delay before fetching events to ensure the dialog is fully closed
    setTimeout(() => {
    fetchEvents(); // Refresh events after dialog closes
    }, 100);
  }, [fetchEvents]);

  // Memoize the event dialog component
  const eventDialog = useMemo(() => (
    <EventDialog
      open={openDialog}
      onClose={handleCloseDialog}
      event={selectedEvent}
      onEventSaved={fetchEvents}
      fetchEvents={fetchEvents}
    />
  ), [openDialog, handleCloseDialog, selectedEvent, fetchEvents]);

  // Update the stats display section
  const getEventCount = (status) => {
    return stats?.eventStats.find(s => s._id === status)?.count || 0;
  };

  const handleDelete = async (eventId) => {
    if (!user || !window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

    try {
      setLoading(true);
      const token = await session.getToken();
      
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-User-Email': user.primaryEmailAddress.emailAddress
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove the event from the local state
      setEvents(events.filter(event => event._id !== eventId));
      // Refresh events to update counts
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please sign in to access the admin dashboard.
        </Alert>
      </Container>
    );
  }

  // Mock data for testing
  const mockEvents = [
    {
      _id: '1',
      title: 'Test Event 1',
      description: 'Test Description',
      date: new Date(),
      time: '18:00',
      location: 'Test Location',
      status: 'PENDING',
      capacity: 100,
      budget: 10000,
      organizer: {
        _id: '507f1f77bcf86cd799439011',
        profile: {
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    }
  ];

  const mockStats = {
    totalEvents: 1,
    eventStats: [
      { _id: 'PENDING', count: 1 },
      { _id: 'PUBLISHED', count: 0 }
    ],
    organizerCount: 1
  };

  // Use mock data if no real data is available
  const displayEvents = events.length > 0 ? events : mockEvents;
  const displayStats = stats || mockStats;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Admin Dashboard
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog(null)}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Create New Event
        </Button>
      </Box>

      {displayStats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6">Total Events</Typography>
              <Typography variant="h4">{displayStats.totalEvents}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6">Pending Review</Typography>
              <Typography variant="h4">{getEventCount('PENDING')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6">Published Events</Typography>
              <Typography variant="h4">{getEventCount('PUBLISHED')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <Typography variant="h6">Organizers</Typography>
              <Typography variant="h4">{displayStats.organizerCount}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{
          mb: 4,
          '& .MuiTab-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-selected': {
              color: 'primary.main',
            },
          },
        }}
      >
        <Tab label={`Pending (${getEventCount('PENDING')})`} />
        <Tab label={`Approved (${getEventCount('APPROVED')})`} />
        <Tab label={`Published (${getEventCount('PUBLISHED')})`} />
        <Tab label={`Rejected (${getEventCount('REJECTED')})`} />
      </Tabs>

      <Grid container spacing={4}>
        {filteredEvents.map((event) => (
          <Grid item key={event._id} xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={event.image || `https://source.unsplash.com/random/800x600/?concert,${event._id}`}
                  alt={event.title}
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  onError={(e) => {
                    console.log("Image failed to load:", event.image?.substring(0, 30) + "...");
                    // Use a fallback image
                    e.target.src = `https://source.unsplash.com/random/800x600/?concert,${event._id}`;
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={event.status}
                    color={getStatusColor(event.status)}
                    size="small"
                  />
                </Box>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {event.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<CalendarToday fontSize="small" />}
                      label={dayjs(event.date).format('MMM D, YYYY')}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Chip
                      icon={<AccessTime fontSize="small" />}
                      label={event.time}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                    <Chip
                      icon={<LocationOn fontSize="small" />}
                      label={event.venue?.name || event.location}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>

                  {/* Venue Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                      Venue Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.venue?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.venue?.address?.street}, {event.venue?.address?.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Capacity: {event.venue?.capacity || event.capacity} people
                    </Typography>
                  </Box>

                  {/* Artists Section */}
                  {event.artists && event.artists.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                        Featured Artists
                      </Typography>
                      <Grid container spacing={1}>
                        {event.artists.map((artist, index) => (
                          <Grid item xs={12} key={index}>
                            <Box sx={{ 
                              p: 2, 
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }}>
                              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                {artist.image && (
                                  <Box
                                    component="img"
                                    src={artist.image}
                                    alt={artist.name}
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      borderRadius: 1,
                                      objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                      e.target.src = `https://via.placeholder.com/80x80?text=${encodeURIComponent(artist.name || 'Artist')}`;
                                    }}
                                  />
                                )}
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6">
                                    {artist.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    {artist.genre}
                                  </Typography>
                                  
                                  {/* Social Media Icons */}
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    {artist.social?.instagram && (
                                      <IconButton 
                                        size="small" 
                                        component="a" 
                                        href={artist.social.instagram.startsWith('http') ? artist.social.instagram : `https://instagram.com/${artist.social.instagram}`}
                                        target="_blank"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                      >
                                        <Instagram fontSize="small" />
                                      </IconButton>
                                    )}
                                    {artist.social?.facebook && (
                                      <IconButton 
                                        size="small" 
                                        component="a" 
                                        href={artist.social.facebook.startsWith('http') ? artist.social.facebook : `https://facebook.com/${artist.social.facebook}`}
                                        target="_blank"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                      >
                                        <Facebook fontSize="small" />
                                      </IconButton>
                                    )}
                                    {artist.social?.youtube && (
                                      <IconButton 
                                        size="small" 
                                        component="a" 
                                        href={artist.social.youtube.startsWith('http') ? artist.social.youtube : `https://youtube.com/${artist.social.youtube}`}
                                        target="_blank"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                      >
                                        <YouTube fontSize="small" />
                                      </IconButton>
                                    )}
                                    {artist.social?.twitter && (
                                      <IconButton 
                                        size="small" 
                                        component="a" 
                                        href={artist.social.twitter.startsWith('http') ? artist.social.twitter : `https://twitter.com/${artist.social.twitter}`}
                                        target="_blank"
                                        sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                      >
                                        <Twitter fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                              
                              {/* Artist Description */}
                              {artist.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {artist.description.length > 150 
                                    ? `${artist.description.substring(0, 150)}...` 
                                    : artist.description}
                                </Typography>
                              )}
                              
                              {/* Popular Songs */}
                              {artist.popularSongs && artist.popularSongs.length > 0 && artist.popularSongs[0] && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="subtitle2" sx={{ color: 'primary.light', mb: 0.5 }}>
                                    <MusicNote fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Popular Songs
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {artist.popularSongs.filter(song => song.trim()).slice(0, 3).map((song, idx) => (
                                      <Chip 
                                        key={idx} 
                                        label={song} 
                                        size="small" 
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} 
                                      />
                                    ))}
                                    {artist.popularSongs.filter(song => song.trim()).length > 3 && (
                                      <Chip 
                                        label={`+${artist.popularSongs.filter(song => song.trim()).length - 3} more`} 
                                        size="small" 
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
                                      />
                                    )}
                                  </Box>
                                </Box>
                              )}
                              
                              {/* Achievements */}
                              {artist.achievements && artist.achievements.length > 0 && artist.achievements[0] && (
                                <Box>
                                  <Typography variant="subtitle2" sx={{ color: 'primary.light', mb: 0.5 }}>
                                    <Star fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                                    Achievements
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {artist.achievements.filter(achievement => achievement.trim()).slice(0, 2).map((achievement, idx) => (
                                      <Chip 
                                        key={idx} 
                                        label={achievement} 
                                        size="small" 
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} 
                                      />
                                    ))}
                                    {artist.achievements.filter(achievement => achievement.trim()).length > 2 && (
                                      <Chip 
                                        label={`+${artist.achievements.filter(achievement => achievement.trim()).length - 2} more`} 
                                        size="small" 
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }} 
                                      />
                                    )}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Ticket Types Section */}
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                        Ticket Types
                      </Typography>
                      <Grid container spacing={1}>
                        {event.ticketTypes.map((ticket, index) => (
                          <Grid item xs={12} key={index}>
                            <Box sx={{ 
                              p: 1.5, 
                              borderRadius: 1,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="subtitle2">
                                  {ticket.name}
                                </Typography>
                                <Typography variant="subtitle2" color="primary">
                                  ₨ {ticket.price}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {ticket.description}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Available: {ticket.quantity}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Submitted by: {event.organizer?.profile?.firstName} {event.organizer?.profile?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {dayjs(event.createdAt).format('MMM D, YYYY')}
                    </Typography>
                  </Box>

                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      {event.status === 'PENDING' && (
                        <>
                          <Button
                            startIcon={<CheckCircle />}
                            color="success"
                            onClick={() => handleAction(event, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button
                            startIcon={<Cancel />}
                            color="error"
                            onClick={() => handleAction(event, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {event.status === 'APPROVED' && (
                        <Button
                          startIcon={<PublishIcon />}
                          color="primary"
                          onClick={() => handleAction(event, 'PUBLISHED')}
                        >
                          Publish
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <Button
                        color="primary"
                        onClick={() => handleOpenDialog(event)}
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(event._id)}
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardActions>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {eventDialog}
    </Container>
  );
};

export default AdminDashboard; 