import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import HeaderManagement from '../../components/admin/headerfooter/HeaderManagement';
import FooterManagement from '../../components/admin/headerfooter/FooterManagement';

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
      id={`headerfooter-tabpanel-${index}`}
      aria-labelledby={`headerfooter-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const HeaderFooterManagement: React.FC = () => {
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
          aria-label="header footer management tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Header" />
          <Tab label="Footer" />
        </Tabs>
      </Paper>

      <TabPanel value={currentTab} index={0}>
        <HeaderManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <FooterManagement />
      </TabPanel>
    </Box>
  );
};

export default HeaderFooterManagement;

