import { View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  strong: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  rightText: {
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  description: {
    color: '#364153',
    fontSize: 12,
  },
  link: {
    textDecoration: 'underline',
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

const PublicationEntry = ({ title, link, date, publisher, description }) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View>
        <View style={styles.titleWrap}>
          <Text style={styles.strong}>{title}</Text>
          {/* {link && (
            <Link src={link} style={styles.link}>
              🔗
            </Link>
          )} */}
        </View>
        {publisher && <Text style={styles.italic}>{publisher}</Text>}
      </View>
      {date && <Text style={styles.rightText}>{date}</Text>}
    </View>
    {description && <Html style={styles.description}>{styleDescriptionHTML(description)}</Html>}
  </View>
);

export default PublicationEntry;
