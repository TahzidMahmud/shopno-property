import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  CardMedia,
  Rating,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { 
  AboutPageProject, 
  AboutPageProjectFormData,
  AboutPageTeamMember,
  AboutPageTeamMemberFormData,
  AboutPageTestimonial,
  AboutPageTestimonialFormData
} from '../../types/AboutPage';
import { 
  aboutPageService, 
  aboutPageProjectService, 
  aboutPageTeamMemberService, 
  aboutPageTestimonialService 
} from '../../services/aboutPageService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AboutPageManagement: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<AboutPageProject[]>([]);
  const [teamMembers, setTeamMembers] = useState<AboutPageTeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<AboutPageTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openTestimonialDialog, setOpenTestimonialDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<AboutPageProject | null>(null);
  const [editingTeam, setEditingTeam] = useState<AboutPageTeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<AboutPageTestimonial | null>(null);
  const [projectFormData, setProjectFormData] = useState<AboutPageProjectFormData>({
    title: '',
    subtitle: '',
    image: null,
    order: 0,
    is_active: true,
  });
  const [teamFormData, setTeamFormData] = useState<AboutPageTeamMemberFormData>({
    name: '',
    position: '',
    image: null,
    order: 0,
    is_active: true,
  });
  const [testimonialFormData, setTestimonialFormData] = useState<AboutPageTestimonialFormData>({
    quote: '',
    author_name: '',
    author_position: '',
    author_company: '',
    rating: 5,
    image: null,
    order: 0,
    is_active: true,
  });
  const [settingKey, setSettingKey] = useState('');
  const [settingValue, setSettingValue] = useState('');
  const [settingFile, setSettingFile] = useState<File | null>(null);
  const [settingPreview, setSettingPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await aboutPageService.getAll();
      setSettings(data.settings || {});
      setProjects(data.projects || []);
      setTeamMembers(data.team_members || []);
      setTestimonials(data.testimonials || []);
    } catch (error) {
      showNotification('Failed to load about page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Project handlers
  const handleOpenProjectDialog = (project?: AboutPageProject) => {
    if (project) {
      setEditingProject(project);
      setProjectFormData({
        title: project.title,
        subtitle: project.subtitle || '',
        image: null,
        order: project.order,
        is_active: project.is_active,
      });
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: '',
        subtitle: '',
        image: null,
        order: projects.length,
        is_active: true,
      });
    }
    setOpenProjectDialog(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject && editingProject.id) {
        await aboutPageProjectService.update(editingProject.id, projectFormData);
        showNotification('Project updated successfully');
      } else {
        await aboutPageProjectService.create(projectFormData);
        showNotification('Project created successfully');
      }
      handleCloseProjectDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to save project', 'error');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await aboutPageProjectService.delete(id);
        showNotification('Project deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete project', 'error');
      }
    }
  };

  // Team member handlers
  const handleOpenTeamDialog = (member?: AboutPageTeamMember) => {
    if (member) {
      setEditingTeam(member);
      setTeamFormData({
        name: member.name,
        position: member.position,
        image: null,
        order: member.order,
        is_active: member.is_active,
      });
    } else {
      setEditingTeam(null);
      setTeamFormData({
        name: '',
        position: '',
        image: null,
        order: teamMembers.length,
        is_active: true,
      });
    }
    setOpenTeamDialog(true);
  };

  const handleSaveTeam = async () => {
    try {
      if (editingTeam && editingTeam.id) {
        await aboutPageTeamMemberService.update(editingTeam.id, teamFormData);
        showNotification('Team member updated successfully');
      } else {
        await aboutPageTeamMemberService.create(teamFormData);
        showNotification('Team member created successfully');
      }
      handleCloseTeamDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to save team member', 'error');
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await aboutPageTeamMemberService.delete(id);
        showNotification('Team member deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete team member', 'error');
      }
    }
  };

  // Testimonial handlers
  const handleOpenTestimonialDialog = (testimonial?: AboutPageTestimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialFormData({
        quote: testimonial.quote,
        author_name: testimonial.author_name,
        author_position: testimonial.author_position,
        author_company: testimonial.author_company || '',
        rating: testimonial.rating,
        image: null,
        order: testimonial.order,
        is_active: testimonial.is_active,
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialFormData({
        quote: '',
        author_name: '',
        author_position: '',
        author_company: '',
        rating: 5,
        image: null,
        order: testimonials.length,
        is_active: true,
      });
    }
    setOpenTestimonialDialog(true);
  };

  const handleSaveTestimonial = async () => {
    try {
      if (editingTestimonial && editingTestimonial.id) {
        await aboutPageTestimonialService.update(editingTestimonial.id, testimonialFormData);
        showNotification('Testimonial updated successfully');
      } else {
        await aboutPageTestimonialService.create(testimonialFormData);
        showNotification('Testimonial created successfully');
      }
      handleCloseTestimonialDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to save testimonial', 'error');
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await aboutPageTestimonialService.delete(id);
        showNotification('Testimonial deleted successfully');
        loadData();
      } catch (error) {
        showNotification('Failed to delete testimonial', 'error');
      }
    }
  };

  // Settings handlers
  const handleOpenSettingsDialog = (key: string, value: string = '') => {
    setSettingKey(key);
    setSettingValue(value);
    setSettingFile(null);
    setSettingPreview(null);
    setOpenSettingsDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'project' | 'team' | 'testimonial' | 'setting') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'setting') {
        setSettingFile(file);
        setSettingPreview(URL.createObjectURL(file));
      } else if (type === 'project') {
        setProjectFormData(prev => ({ ...prev, image: file }));
      } else if (type === 'team') {
        setTeamFormData(prev => ({ ...prev, image: file }));
      } else if (type === 'testimonial') {
        setTestimonialFormData(prev => ({ ...prev, image: file }));
      }
    }
  };

  const handleSaveSetting = async () => {
    try {
      await aboutPageService.updateSetting({
        key: settingKey,
        value: settingValue,
        file: settingFile,
      });
      showNotification('Setting updated successfully');
      handleCloseSettingsDialog();
      loadData();
    } catch (error) {
      showNotification('Failed to update setting', 'error');
    }
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setEditingProject(null);
    setProjectFormData({
      title: '',
      subtitle: '',
      image: null,
      order: 0,
      is_active: true,
    });
  };

  const handleCloseTeamDialog = () => {
    setOpenTeamDialog(false);
    setEditingTeam(null);
    setTeamFormData({
      name: '',
      position: '',
      image: null,
      order: 0,
      is_active: true,
    });
  };

  const handleCloseTestimonialDialog = () => {
    setOpenTestimonialDialog(false);
    setEditingTestimonial(null);
    setTestimonialFormData({
      quote: '',
      author_name: '',
      author_position: '',
      author_company: '',
      rating: 5,
      image: null,
      order: 0,
      is_active: true,
    });
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
    setSettingKey('');
    setSettingValue('');
    setSettingFile(null);
    setSettingPreview(null);
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `/storage/${path}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        About Page Management
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)}>
          <Tab label="Settings" />
          <Tab label="Projects" />
          <Tab label="Team Members" />
          <Tab label="Testimonials" />
        </Tabs>
      </Paper>

      {/* Settings Tab */}
      <TabPanel value={currentTab} index={0}>
        <Grid container spacing={2}>
          {[
            { key: 'hero_title', label: 'Hero Title', default: 'About Us' },
            { key: 'hero_background_image', label: 'Hero Background Image', default: '' },
            { key: 'vision_title', label: 'Vision Title', default: 'Where Vision Meets Value' },
            { key: 'vision_description', label: 'Vision Description', default: '' },
            { key: 'vision_image', label: 'Vision Image', default: '' },
            { key: 'award_badge', label: 'Award Badge Text', default: 'Award Winning Company In The Shopno Property' },
            { key: 'stat_projects', label: 'Projects Stat', default: '50+' },
            { key: 'stat_customers', label: 'Customers Stat', default: '48+' },
            { key: 'stat_success_rate', label: 'Success Rate Stat', default: '45%' },
            { key: 'stat_team', label: 'Team Stat', default: '5+' },
            { key: 'projects_title', label: 'Projects Title', default: 'Discover Our Signature Projects' },
            { key: 'projects_subtitle', label: 'Projects Subtitle', default: '' },
            { key: 'team_title', label: 'Team Title', default: 'Our Professional Team Member' },
            { key: 'chairman_name', label: 'Chairman Name', default: 'MD. Sirajul Islam' },
            { key: 'chairman_position', label: 'Chairman Position', default: 'MANAGING DIRECTOR' },
            { key: 'chairman_image', label: 'Chairman Image', default: '' },
            { key: 'chairman_message', label: 'Chairman Message', default: '' },
            { key: 'testimonials_title', label: 'Testimonials Title', default: 'Hear What Our Client Say' },
            { key: 'testimonials_subtitle', label: 'Testimonials Subtitle', default: '' },
          ].map((setting) => (
            <Grid item xs={12} md={6} key={setting.key}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOpenSettingsDialog(setting.key, settings[setting.key] || setting.default)}
              >
                Edit {setting.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Projects Tab */}
      <TabPanel value={currentTab} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Signature Projects</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenProjectDialog()}>
            Add Project
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Subtitle</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <CardMedia
                      component="img"
                      image={getImageUrl(project.image) || '/assets/house1.jpg'}
                      alt={project.title}
                      sx={{ width: 80, height: 60, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.subtitle || '-'}</TableCell>
                  <TableCell>{project.order}</TableCell>
                  <TableCell>{project.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenProjectDialog(project)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => project.id && handleDeleteProject(project.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Team Members Tab */}
      <TabPanel value={currentTab} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Team Members</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenTeamDialog()}>
            Add Team Member
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <CardMedia
                      component="img"
                      image={getImageUrl(member.image) || '/assets/house1.jpg'}
                      alt={member.name}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.order}</TableCell>
                  <TableCell>{member.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenTeamDialog(member)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => member.id && handleDeleteTeam(member.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Testimonials Tab */}
      <TabPanel value={currentTab} index={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Testimonials</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenTestimonialDialog()}>
            Add Testimonial
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Author</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>{testimonial.author_name}</TableCell>
                  <TableCell>{testimonial.author_position}</TableCell>
                  <TableCell>{testimonial.rating}/5</TableCell>
                  <TableCell>{testimonial.order}</TableCell>
                  <TableCell>{testimonial.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenTestimonialDialog(testimonial)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => testimonial.id && handleDeleteTestimonial(testimonial.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Project Dialog */}
      <Dialog open={openProjectDialog} onClose={handleCloseProjectDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={projectFormData.title}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              label="Subtitle"
              fullWidth
              value={projectFormData.subtitle}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'project')} />
            {(projectFormData.image || (editingProject && editingProject.image)) && (
              <CardMedia
                component="img"
                image={projectFormData.image ? URL.createObjectURL(projectFormData.image) : getImageUrl(editingProject?.image) || ''}
                alt="Preview"
                sx={{ maxHeight: 200, objectFit: 'contain' }}
              />
            )}
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={projectFormData.order}
              onChange={(e) => setProjectFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={projectFormData.is_active}
                  onChange={(e) => setProjectFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained" disabled={!projectFormData.title}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Member Dialog */}
      <Dialog open={openTeamDialog} onClose={handleCloseTeamDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTeam ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={teamFormData.name}
              onChange={(e) => setTeamFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <TextField
              label="Position"
              fullWidth
              value={teamFormData.position}
              onChange={(e) => setTeamFormData(prev => ({ ...prev, position: e.target.value }))}
            />
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'team')} />
            {(teamFormData.image || (editingTeam && editingTeam.image)) && (
              <CardMedia
                component="img"
                image={teamFormData.image ? URL.createObjectURL(teamFormData.image) : getImageUrl(editingTeam?.image) || ''}
                alt="Preview"
                sx={{ maxHeight: 200, objectFit: 'contain' }}
              />
            )}
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={teamFormData.order}
              onChange={(e) => setTeamFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={teamFormData.is_active}
                  onChange={(e) => setTeamFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamDialog}>Cancel</Button>
          <Button onClick={handleSaveTeam} variant="contained" disabled={!teamFormData.name || !teamFormData.position}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={openTestimonialDialog} onClose={handleCloseTestimonialDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Quote"
              fullWidth
              multiline
              rows={4}
              value={testimonialFormData.quote}
              onChange={(e) => setTestimonialFormData(prev => ({ ...prev, quote: e.target.value }))}
            />
            <TextField
              label="Author Name"
              fullWidth
              value={testimonialFormData.author_name}
              onChange={(e) => setTestimonialFormData(prev => ({ ...prev, author_name: e.target.value }))}
            />
            <TextField
              label="Author Position"
              fullWidth
              value={testimonialFormData.author_position}
              onChange={(e) => setTestimonialFormData(prev => ({ ...prev, author_position: e.target.value }))}
            />
            <TextField
              label="Author Company"
              fullWidth
              value={testimonialFormData.author_company}
              onChange={(e) => setTestimonialFormData(prev => ({ ...prev, author_company: e.target.value }))}
            />
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={testimonialFormData.rating}
                onChange={(e, newValue) => setTestimonialFormData(prev => ({ ...prev, rating: newValue || 5 }))}
              />
            </Box>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'testimonial')} />
            {(testimonialFormData.image || (editingTestimonial && editingTestimonial.image)) && (
              <CardMedia
                component="img"
                image={testimonialFormData.image ? URL.createObjectURL(testimonialFormData.image) : getImageUrl(editingTestimonial?.image) || ''}
                alt="Preview"
                sx={{ maxHeight: 200, objectFit: 'contain' }}
              />
            )}
            <TextField
              label="Order"
              type="number"
              fullWidth
              value={testimonialFormData.order}
              onChange={(e) => setTestimonialFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={testimonialFormData.is_active}
                  onChange={(e) => setTestimonialFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTestimonialDialog}>Cancel</Button>
          <Button onClick={handleSaveTestimonial} variant="contained" disabled={!testimonialFormData.quote || !testimonialFormData.author_name || !testimonialFormData.author_position}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={handleCloseSettingsDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Setting: {settingKey}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            {settingKey.includes('image') || settingKey.includes('background') ? (
              <>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'setting')} />
                {(settingPreview || getImageUrl(settingValue)) && (
                  <CardMedia
                    component="img"
                    image={settingPreview || getImageUrl(settingValue) || ''}
                    alt="Preview"
                    sx={{ maxHeight: 200, objectFit: 'contain' }}
                  />
                )}
              </>
            ) : (
              <TextField
                label="Value"
                fullWidth
                multiline={settingKey.includes('description') || settingKey.includes('message')}
                rows={settingKey.includes('description') || settingKey.includes('message') ? 4 : 1}
                value={settingValue}
                onChange={(e) => setSettingValue(e.target.value)}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>Cancel</Button>
          <Button onClick={handleSaveSetting} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AboutPageManagement;

