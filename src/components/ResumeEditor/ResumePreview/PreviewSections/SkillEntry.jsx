import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  section: { marginBottom: 10 },
  skillItem: { marginBottom: 6 },
  bold: { fontWeight: 700 },
  gridCol2: { flexDirection: 'row', flexWrap: 'wrap' },
    gridItem: {
    flexBasis: '50%',
    maxWidth: '50%',
    paddingRight: 10,
  },
  levelDots: { flexDirection: 'row', gap: 2, marginLeft: 4 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 2,
  },
  barContainer: {
    width: 60,
    height: 4,
    backgroundColor: '#ccc',
    marginLeft: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    backgroundColor: '#000',
  },
  bubble: {
    border: '1 solid #000',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  }
});

const levelMap = {
  BEGINNER: 1,
  AMATEUR: 2,
  COMPETENT: 3,
  PROFICIENT: 4,
  EXPERT: 5,
};

const SkillEntry = ({ skills, style }) => {
  const { layout, layoutInfo, subInfoStyle } = style;

  return (
    <View style={styles.section} wrap={false}>
      {/* GRID layout */}
      {layout === "grid" && (
        <View style={styles.gridCol2} wrap={true}>
          {skills.rankedSkills.map((skill) => (
            <View key={skill._id} style={styles.gridItem}>
              <Text style={styles.bold}>{skill.name}</Text>
              {skill.subSkills.map((s, idx) => (
                <Text key={idx}>• {s}</Text>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* LEVEL layout */}
      {layout === "level" && (
        <View style={styles.gridCol2}>
          {skills.rankedSkills.map((skill) => {
            const level = levelMap[skill.level.toUpperCase()] || 0;

            return (
              <View key={skill._id} style={{ marginBottom: 8, width: '50%',  }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.bold}>
                    {skill.name}
                    {layoutInfo === 'text' && ` — ${skill.level.toLowerCase()}`}
                  </Text>

                  {/* Dots */}
                  {layoutInfo === "dots" && (
                    <View style={{ flexDirection: 'row' }}>
                      {[...Array(5)].map((_, idx) => (
                        <View
                          key={idx}
                          style={{
                            ...styles.dot,
                            backgroundColor: idx < level ? '#000' : '#ccc',
                          }}
                        />
                      ))}
                    </View>
                  )}

                  {/* Bar */}
                  {layoutInfo === "bar" && (
                    <View style={styles.barContainer}>
                      <View style={{ ...styles.barFill, width: `${(level / 5) * 100}%` }} />
                    </View>
                  )}
                </View>

                {skill.subSkills.map((s, idx) => (
                  <Text key={idx}>• {s}</Text>
                ))}
              </View>
            );
          })}
        </View>
      )}

      {/* COMPACT layout */}
      {layout === "compact" && (
        <View style={{ flexDirection: layoutInfo !== "newline" ? "row" : "column", flexWrap: "wrap" }}>
          {skills.rankedSkills.map((skill, idx) => {
            const delimiter = {
              bullet: ' • ',
              pipe: ' | ',
              comma: ', ',
              newline: ' | '
            }[layoutInfo] || ' ';

            const subStart = {
              dash: ' — ',
              colon: ' : ',
              bracket: ' ('
            }[subInfoStyle] || ' ';

            const subEnd = subInfoStyle === "bracket" ? ')' : '';

            return (
              <View key={skill._id} style={{ marginRight: 8 }}>
                <Text>
                  <Text style={styles.bold}>{skill.name}{subStart}</Text>
                  {skill.subSkills.map((s, idx2) => (
                    <Text key={idx2}>
                      {s}{idx2 < skill.subSkills.length - 1 ? delimiter : ''}
                    </Text>
                  ))}
                  {subEnd}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* BUBBLE layout */}
      {layout === "bubble" && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {skills.rankedSkills.map((skill) => (
            <View key={skill._id} style={styles.bubble}>
              <Text>
                <Text style={styles.bold}>
                  {skill.name}
                  {subInfoStyle === 'dash' && ' —'}
                  {subInfoStyle === 'colon' && ' :'}
                  {subInfoStyle === 'bracket' && ' ('}
                </Text>
                {skill.subSkills.map((s, idx2) => (
                  <Text key={idx2}>
                    {s}{idx2 < skill.subSkills.length - 1 ? ' | ' : ''}
                  </Text>
                ))}
                {subInfoStyle === 'bracket' && ')'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default SkillEntry;
