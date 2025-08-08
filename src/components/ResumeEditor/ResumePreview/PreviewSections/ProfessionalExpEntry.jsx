import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'column',
  },
  rightCol: {
    textAlign: 'right',
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  htmlDescription: {
    marginTop: 2,
    fontSize: 12,
  }
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

const ProfessionalExpEntry = ({ title, subtitle, location, date, description, style }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.leftCol}>
          {style?.titleSubtitleOrder === 'employer-JobTitle' ? (
            <>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </>
          ) : (
            <>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              <Text style={styles.title}>{title}</Text>
            </>
          )}
        </View>
        {(date || location) && (
          <Text style={styles.rightCol}>
            {date}
            {location && ` | ${location}`}
          </Text>
        )}
      </View>

      {description && (
        <View style={styles.htmlDescription}>
          <Html style={styles.htmlDescription}>{styleDescriptionHTML(description)}</Html>
        </View>
      )}

    </View>
  );
};

export default ProfessionalExpEntry;
