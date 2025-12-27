import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
} from '@mui/material';
import { Role, RoleFormData, Permission, roleService } from '../../services/roleService';

interface RoleFormProps {
  role?: Role;
  onSubmit: (data: RoleFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  role,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    permissions: [],
  });
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPermissions();
  }, []);

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        permissions: role.permissions?.map((p) => p.name) || [],
      });
    } else {
      setFormData({
        name: '',
        permissions: [],
      });
    }
  }, [role]);

  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const permissions = await roleService.getPermissions();
      setAllPermissions(permissions);
    } catch (error: any) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleInputChange = (field: keyof RoleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionToggle = (permissionName: string) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permissionName)
        ? prev.permissions.filter((p) => p !== permissionName)
        : [...prev.permissions, permissionName];
      return { ...prev, permissions };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  // Get property-related permissions
  const propertyPermissions = allPermissions.filter((p) =>
    p.name.startsWith('properties.')
  );

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {role ? 'Edit Role' : 'Add New Role'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Permissions
            </Typography>
            {loadingPermissions ? (
              <CircularProgress size={24} />
            ) : (
              <FormGroup>
                {propertyPermissions.map((permission) => (
                  <FormControlLabel
                    key={permission.id}
                    control={
                      <Checkbox
                        checked={formData.permissions.includes(permission.name)}
                        onChange={() => handlePermissionToggle(permission.name)}
                      />
                    }
                    label={permission.name}
                  />
                ))}
              </FormGroup>
            )}
          </Grid>

          {formData.permissions.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Selected:
                </Typography>
                {formData.permissions.map((permName) => (
                  <Chip key={permName} label={permName} size="small" />
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RoleForm;


