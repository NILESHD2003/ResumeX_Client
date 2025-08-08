import { View, Text, Link } from "@react-pdf/renderer";

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

const OrganizationEntry = ({ title, link, date, description, location }) => (
  <View style={{ marginBottom: 6 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexShrink: 1, marginRight: 6 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
          <Text style={{ fontWeight: "bold" }}>{title}</Text>
          {/* {link && (
            <Link src={link} style={{ textDecoration: "underline", marginLeft: 4 }}>
              🔗
            </Link>
          )} */}
        </View>
      </View>
      {(date || location) && (
        <Text style={{ whiteSpace: "nowrap", textAlign: "right" }}>
          {date}
          {location && ` | ${location}`}
        </Text>
      )}
    </View>
    {description && (
      <View style={{ marginTop: 2 }}>
        {styleDescriptionHTML(description)}
      </View>
    )}
  </View>
);

export default OrganizationEntry;
