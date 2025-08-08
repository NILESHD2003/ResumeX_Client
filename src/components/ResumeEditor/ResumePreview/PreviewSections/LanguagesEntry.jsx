import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    marginBottom: 6,
  },
  languageName: {
    fontWeight: 'bold',
  },
  barContainer: {
    width: 80,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 6,
    marginTop: 2,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  dotRow: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 2,
  },
  compactItem: {
    marginRight: 6,
    marginBottom: 4,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bubble: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 6,
    marginBottom: 6,
    border: '1px solid #000000',
    borderRadius: 4,
  },
});

const levelMap = {
  BASIC: 1,
  CONVERSATIONAL: 2,
  PROFICIENT: 3,
  FLUENT: 4,
  NATIVE: 5,
};

const LanguagesEntry = ({ languages, style }) => {
  return (
    <View>
      {style.layout === 'grid' && (
        <View style={styles.gridContainer}>
          {languages.map((lang) => (
            <View key={lang._id} style={styles.gridItem}>
              <Text style={styles.languageName}>{lang.name}</Text>
              {lang.additionalInfo && <Text>{lang.additionalInfo}</Text>}
            </View>
          ))}
        </View>
      )}

      {style.layout === 'level' && (
        <View style={styles.gridContainer}>
          {languages.map((lang) => {
            const level = levelMap[lang.level?.toUpperCase()] || 0;
            return (
              <View key={lang._id} style={styles.gridItem}>
                <Text style={styles.languageName}>
                  {lang.name}
                  {style.layoutInfo === 'text' ? ` — ${lang.level?.toLowerCase()}` : ''}
                </Text>

                {style.layoutInfo === 'dots' && (
                  <View style={styles.dotRow}>
                    {[...Array(5)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: i < level ? '#000000' : '#d1d5dc',
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}

                {style.layoutInfo === 'bar' && (
                  <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: `${(level / 5) * 100}%` }]} />
                  </View>
                )}

                {lang.additionalInfo && <Text>{lang.additionalInfo}</Text>}
              </View>
            );
          })}
        </View>
      )}

      {style.layout === 'compact' && (
        <View style={styles.compactItem}>
          {languages.map((lang, idx) => (
            <Text key={lang._id}>
              <Text style={styles.languageName}>
                {lang.name}
                {style.subInfoStyle === 'dash' && ' —'}
                {style.subInfoStyle === 'colon' && ' :'}
                {style.subInfoStyle === 'bracket' && ' ('}
              </Text>
              <Text>
                {lang.additionalInfo || ''}
                {style.subInfoStyle === 'bracket' && ')'}
              </Text>
              {style.layoutInfo === 'pipe' && idx !== languages.length - 1 && ' | '}
              {style.layoutInfo === 'comma' && idx !== languages.length - 1 && ', '}
              {style.layoutInfo === 'bullet' && idx !== languages.length - 1 && ' • '}
            </Text>
          ))}
        </View>
      )}

      {style.layout === 'bubble' && (
        <View style={styles.gridContainer}>
          {languages.map((lang) => (
            <View key={lang._id} style={styles.bubble}>
              <Text>
                <Text style={styles.languageName}>
                  {lang.name}
                  {style.subInfoStyle === 'dash' && ' —'}
                  {style.subInfoStyle === 'colon' && ' :'}
                  {style.subInfoStyle === 'bracket' && ' ('}
                </Text>
                <Text>{lang.additionalInfo || ''}</Text>
                {style.subInfoStyle === 'bracket' && ')'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default LanguagesEntry;
