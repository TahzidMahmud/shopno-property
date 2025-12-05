# Property Management Admin Dashboard

This is a complete CRUD (Create, Read, Update, Delete) system for managing properties using React frontend and Laravel API backend.

## Features

### 🏠 Property Management
- **Create Properties**: Add new properties with comprehensive details
- **View Properties**: Browse all properties in a paginated table with search functionality
- **Edit Properties**: Update existing property information
- **Delete Properties**: Remove properties with confirmation dialog
- **Property Details**: View detailed information about each property

### 📋 Property Fields
- Basic Information: Title, Status, Area, Location, Type
- Property Details: Total floors, flats, bedrooms, bathrooms, flat size, parking
- Pricing: Price range, development status
- Media: Main image, layout images, gallery images, demo video
- Location: Full address, key transportation options
- Company: Company name

### 🎨 User Interface
- Material-UI components for professional look
- Responsive design for all screen sizes
- Search and filter functionality
- Pagination for large datasets
- Loading states and error handling
- Success/error notifications

## File Structure

```
resources/js/
├── components/
│   ├── admin/
│   │   ├── PropertyForm.tsx      # Create/Edit form
│   │   ├── PropertyList.tsx      # Properties table with actions
│   │   └── PropertyDetails.tsx   # Detailed property view
│   └── layout/
│       └── AdminLayout.tsx       # Admin dashboard layout
├── pages/
│   ├── admin/
│   │   └── Dashboard.tsx         # Main admin dashboard
│   └── Home.tsx                  # Home page with admin link
├── services/
│   └── propertyService.ts        # API service for CRUD operations
├── types/
│   └── Property.ts               # TypeScript interfaces
└── App.tsx                       # Main app with routing
```

## API Endpoints

The system uses the following Laravel API endpoints:

- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create new property
- `GET /api/properties/{id}` - Get single property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property

## Usage

### Accessing the Admin Dashboard
1. Visit the home page at `/`
2. Click "Go to Admin Dashboard" button
3. You'll be redirected to `/admin/dashboard`

### Managing Properties
1. **View Properties**: The dashboard shows all properties in a table format
2. **Search**: Use the search bar to filter properties by title, location, or company
3. **Add New**: Click "Add New Property" button to create a property
4. **Edit**: Click the edit icon in the actions column
5. **View Details**: Click the view icon to see full property details
6. **Delete**: Click the delete icon and confirm to remove a property

### Form Features
- **File Uploads**: Support for images and videos with preview
- **Dynamic Fields**: Add multiple transportation options
- **Validation**: Client-side and server-side validation
- **Auto-save**: Form data is preserved during editing

## Technical Details

### Frontend Technologies
- React 18 with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend Integration
- Laravel API with file upload support
- CSRF protection
- Image optimization (WebP conversion)
- File storage in public disk

### Key Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during operations
- **File Management**: Automatic file cleanup on delete/update
- **Search & Pagination**: Efficient data browsing

## Development

To run the development server:

```bash
# Install dependencies
npm install

# Start Laravel development server
php artisan serve

# Start Vite development server
npm run dev
```

The admin dashboard will be available at `http://localhost:8000/admin/dashboard`

## Security

- CSRF token protection for all API calls
- File upload validation and size limits
- Input sanitization and validation
- Secure file storage with proper permissions
