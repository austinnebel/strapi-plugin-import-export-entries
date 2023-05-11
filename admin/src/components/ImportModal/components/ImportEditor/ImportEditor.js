import { Box } from '@strapi/design-system/Box';
import { Option, Select } from '@strapi/design-system/Select';
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Tab, TabGroup, TabPanel, TabPanels, Tabs } from '@strapi/design-system/Tabs';
import { Typography } from '@strapi/design-system/Typography';
import React, { useEffect, useState } from 'react';

import ImportProxy from '../../../../api/importProxy';
import { useForm } from '../../../../hooks/useForm';
import { useI18n } from '../../../../hooks/useI18n';
import { Editor } from '../../../Editor/Editor';

export const ImportEditor = ({ file, data, dataFormat, slug, onDataChanged, onOptionsChanged }) => {
  const { i18n } = useI18n();
  const [attributeNames, setAttributeNames] = useState([]);

  const { options, getOption, setOption } = useForm({ idField: 'id', allowNonExistentImages: false });

  useEffect(() => {
    const fetchAttributeNames = async () => {
      const attributeNames = await ImportProxy.getModelAttributes({ slug });
      setAttributeNames(attributeNames);
    };
    fetchAttributeNames();
  }, []);

  useEffect(() => {
    onOptionsChanged(options);
  }, [options]);

  return (
    <>
      <TabGroup label="Import editor" variant="simple">
        <Tabs>
          <Tab>{i18n('plugin.import.tab.file')}</Tab>
          <Tab>{i18n('plugin.import.tab.options')}</Tab>
        </Tabs>

        <TabPanels>
          <TabPanel>
            <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }} color="neutral800" paddingTop={4} paddingBottom={4} background="neutral0">
              {file?.name && (
                <Box style={{ display: 'flex', gap: 8 }} paddingTop={2} paddingBottom={2}>
                  <Typography fontWeight="bold" as="p">
                    {i18n('plugin.import.file-name')} :
                  </Typography>
                  <Typography as="p">{file.name}</Typography>
                </Box>
              )}
              <Editor content={data} language={dataFormat} onChange={onDataChanged} />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box color="neutral800" paddingTop={4} paddingBottom={4} background="neutral0" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Select
                label={i18n('plugin.form.field.id-field.label')}
                hint={i18n('plugin.form.field.id-field.hint')}
                onClear={() => setOption('idField', 'id')}
                value={getOption('idField')}
                onChange={(value) => setOption('idField', value)}
              >
                {attributeNames.map((name) => (
                  <Option key={name} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
              <Checkbox
                onValueChange={(value) => setOption('allowNonExistentImages', value)}
                value={getOption('allowNonExistentImages')}
                hint={i18n('plugin.form.field.allow-non-existent-images-field.hint')}
              >
                {i18n('plugin.form.field.allow-non-existent-images-field.label')}
              </Checkbox>
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
};
