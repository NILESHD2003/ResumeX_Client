import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";
// import { LinkIcon } from "../Icons"; // Use your custom PDF icon component here
import HTML from "react-pdf-html";

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

const CourseEntry = ({ title, link, date, issuer, description }) => (
  <View style={{ marginBottom: 6 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ gap: 2 }}>
        <View style={{ flexDirection: "row", gap: 4, flexWrap: "wrap" }}>
          <Text style={{ fontWeight: "bold" }}>{title}</Text>
          {/* {link && (
            <Link
              src={link}
              style={{ textDecoration: "underline", flexDirection: "row", alignItems: "center", gap: 2 }}
            >
              <LinkIcon size={10} />
            </Link>
          )} */}
        </View>
        {issuer && <Text style={{ fontStyle: "italic" }}>{issuer}</Text>}
      </View>
      {date && <Text style={{ textAlign: "right", whiteSpace: "nowrap" }}>{date}</Text>}
    </View>
    {description && (
        <View style={{fontSize: 12}}>
            <HTML style={{fontSize: 12}}>{styleDescriptionHTML(description)}</HTML>
        </View>
      )}
  </View>
);

export default CourseEntry;
