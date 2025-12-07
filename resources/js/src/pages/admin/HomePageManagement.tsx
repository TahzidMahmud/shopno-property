import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import HeroSlidesManagement from '../../components/admin/homepage/HeroSlidesManagement';
import WhyChooseUsManagement from '../../components/admin/homepage/WhyChooseUsManagement';
import InvestmentBenefitsManagement from '../../components/admin/homepage/InvestmentBenefitsManagement';
import BlogPostsManagement from '../../components/admin/homepage/BlogPostsManagement';
import PartnersManagement from '../../components/admin/homepage/PartnersManagement';
import SearchOptionsManagement from '../../components/admin/homepage/SearchOptionsManagement';
import HomePageSettingsManagement from '../../components/admin/homepage/HomePageSettingsManagement';
import PropertyTypesManagement from '../../components/admin/homepage/PropertyTypesManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`homepage-tabpanel-${index}`}
      aria-labelledby={`homepage-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HomePageManagement: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="homepage management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Hero Slides" />
          <Tab label="Why Choose Us" />
          <Tab label="Investment Benefits" />
          <Tab label="Blog Posts" />
          <Tab label="Partners" />
          <Tab label="Search Options" />
          <Tab label="Property Types" />
          <Tab label="Settings" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        <HeroSlidesManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <WhyChooseUsManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <InvestmentBenefitsManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <BlogPostsManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <PartnersManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={5}>
        <SearchOptionsManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={6}>
        <PropertyTypesManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={7}>
        <HomePageSettingsManagement />
      </TabPanel>
    </Box>
  );
};

export default HomePageManagement;


