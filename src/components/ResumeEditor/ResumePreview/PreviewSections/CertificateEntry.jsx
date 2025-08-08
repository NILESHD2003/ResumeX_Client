import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import HTML from "react-pdf-html";

const styles = StyleSheet.create({
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    marginBottom: 6,
    width: '45%',
  },
  compactContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bubble: {
    padding: '4px 8px',
    marginRight: 6,
    border: '1px solid #000',
    borderRadius: 3,
  },
  italic: {
    fontStyle: 'italic',
  },
  description: {
    fontSize: 12,
  },
});

function styleDescriptionHTML(description) {
  if (!description) return '';

  // Clean up any stray <p> tags inside <li>, which often cause misalignment
  let cleanedDescription = description.replace(/<p(.*?)>/gi, '').replace(/<\/p>/gi, '');

  // Ensure the list has proper styling for react-pdf-html
  cleanedDescription = cleanedDescription
    .replace(/<ul(\s[^>]*)?>/gi, `<ul style="margin: 0; padding-left: 0;">`)
    .replace(/<li(\s[^>]*)?>/gi, `<li>`);

  return cleanedDescription;
}


const CertificateEntry = ({ certificates, style }) => {
  const renderSubInfo = (cert, idx) => {
    const showSeparator = idx !== certificates.length - 1;
    const { subInfoStyle, layoutInfo } = style;
    const infoText = [];

    if (cert.additionalInfo) {
      if (subInfoStyle === 'dash') infoText.push(` — `);
      else if (subInfoStyle === 'colon') infoText.push(` : `);
      else if (subInfoStyle === 'bracket') infoText.push(`(`);
    }

    if (cert.additionalInfo) {
      infoText.push(
        <Text key="info" style={styles.italic}>
          <HTML style={styles.description}>
            {styleDescriptionHTML(cert.additionalInfo)}
          </HTML>
        </Text>
      );
    }

    if (cert.additionalInfo && subInfoStyle === 'bracket') infoText.push(`)`);

    // Add separators for compact view
    if (layoutInfo === 'pipe' && showSeparator) infoText.push(` | `);
    if (layoutInfo === 'comma' && showSeparator) infoText.push(`, `);
    if (layoutInfo === 'bullet' && showSeparator) infoText.push(` • `);

    return infoText;
  };

  return (
    <>
      {style.layout === 'grid' && (
        <View style={styles.gridContainer}>
          {certificates.map((cert) => (
            <View key={cert._id} style={styles.gridItem}>
              <Text>
                <Text>{cert.title}</Text>
              </Text>
              {cert.additionalInfo && (
                <HTML style={styles.description}>{styleDescriptionHTML(cert.additionalInfo)}</HTML>
              )}
            </View>
          ))}
        </View>
      )}

      {style.layout === 'compact' && (
        <View style={styles.compactContainer}>
          {certificates.map((cert, idx) => (
            <Text key={cert._id}>
              <Text>{cert.title}</Text>
              {renderSubInfo(cert, idx)}
              {style.layoutInfo === 'newline' && idx !== certificates.length - 1 && '\n'}
            </Text>
          ))}
        </View>
      )}

      {style.layout === 'bubble' && (
        <View style={styles.compactContainer}>
          {certificates.map((cert) => (
            <View key={cert._id} style={styles.bubble}>
              <Text>
                <Text>{cert.title}</Text>
                {renderSubInfo(cert)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

export default CertificateEntry;
