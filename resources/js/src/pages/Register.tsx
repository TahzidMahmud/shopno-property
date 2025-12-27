import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(
        formData.name,
        formData.phone,
        formData.email || undefined,
        formData.password,
        formData.location || undefined
      );
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'white',
        py: 6,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            height: '51.25px',
            width: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #17badf 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SHOPNO PROPERTY
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* Name Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#2f332d',
                lineHeight: 1.2,
              }}
            >
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  '& fieldset': {
                    border: '1px solid #eee',
                  },
                  '& input': {
                    padding: '12px 15px',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#2f332d',
                    '&::placeholder': {
                      color: '#818181',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Phone Number Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#2f332d',
                lineHeight: 1.2,
              }}
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your number"
              value={formData.phone}
              onChange={handleChange('phone')}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  '& fieldset': {
                    border: '1px solid #eee',
                  },
                  '& input': {
                    padding: '12px 15px',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#2f332d',
                    '&::placeholder': {
                      color: '#818181',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Email Address Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#2f332d',
                lineHeight: 1.2,
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your Email"
              value={formData.email}
              onChange={handleChange('email')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  '& fieldset': {
                    border: '1px solid #eee',
                  },
                  '& input': {
                    padding: '12px 15px',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#2f332d',
                    '&::placeholder': {
                      color: '#818181',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Location Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#2f332d',
                lineHeight: 1.2,
              }}
            >
              Location
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your Address"
              value={formData.location}
              onChange={handleChange('location')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  '& fieldset': {
                    border: '1px solid #eee',
                  },
                  '& input': {
                    padding: '12px 15px',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#2f332d',
                    '&::placeholder': {
                      color: '#818181',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                color: '#2f332d',
                lineHeight: 1.2,
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your Password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#818181' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '45px',
                  borderRadius: '4px',
                  border: '1px solid #eee',
                  '& fieldset': {
                    border: '1px solid #eee',
                  },
                  '& input': {
                    padding: '12px 15px',
                    fontSize: '16px',
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#2f332d',
                    '&::placeholder': {
                      color: '#818181',
                      opacity: 1,
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Register Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              height: '48px',
              borderRadius: '4px',
              bgcolor: '#17badf',
              color: 'white',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 500,
              textTransform: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              '&:hover': {
                bgcolor: '#15a8c9',
              },
              '&:disabled': {
                bgcolor: '#17badf',
                opacity: 0.7,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                Register
                <ArrowForward sx={{ fontSize: '20px' }} />
              </>
            )}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: -2 }}>
            <Typography
              component={Link}
              to="/admin/login"
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: '#17badf',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Login
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;


