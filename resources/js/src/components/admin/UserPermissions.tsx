import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import {
  Role,
  Permission,
  permissionService,
  UserPermissions,
} from '../../services/permissionService';
import { roleService } from '../../services/roleService';

interface UserPermissionsProps {
  userId: number;
  onUpdate?: () => void;
}

const UserPermissionsComponent: React.FC<UserPermissionsProps> = ({
  userId,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [roles, userPerms] = await Promise.all([
        roleService.getAll(),
        permissionService.getUserPermissions(userId),
      ]);

      setAllRoles(roles);
      setUserPermissions(userPerms);

      // Set selected roles only
      setSelectedRoles(userPerms.roles.map((r) => r.name));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await permissionService.syncRoles(userId, selectedRoles);

      setSuccess('Roles updated successfully');
      if (onUpdate) {
        onUpdate();
      }
      // Reload data
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update roles');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Assign Roles to User
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Select roles to assign to this user. Permissions are managed through roles in the Roles Management panel.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Available Roles
        </Typography>
        {allRoles.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No roles found. Create roles in the Roles Management panel first.
          </Alert>
        ) : (
          <FormGroup>
            {allRoles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleChange(role.name)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {role.name}
                    </Typography>
                    {role.permissions && role.permissions.length > 0 ? (
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                          Permissions:
                        </Typography>
                        <Box sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {role.permissions.map((perm) => (
                            <Chip
                              key={perm.id}
                              label={perm.name}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        No permissions assigned
                      </Typography>
                    )}
                  </Box>
                }
              />
            ))}
          </FormGroup>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={loadData} disabled={saving}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? 'Saving...' : 'Save Roles'}
        </Button>
      </Box>
    </Paper>
  );
};

export default UserPermissionsComponent;

