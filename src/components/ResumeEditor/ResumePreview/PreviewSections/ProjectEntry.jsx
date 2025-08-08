import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import HTML from "react-pdf-html";

// You can use unicode for common icons or just abbreviate them
const platformSymbols = {
  WEBSITE: "🌐",
  APP_STORE: "",
  PLAY_STORE: "▶",
  OTHER: "🔗",
  GITHUB: "", // or use "GitHub"
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    flexDirection: "column",
    textAlign: "left",
    flexGrow: 1,
    marginRight: 10,
  },
  rightColumn: {
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  title: {
    fontWeight: "bold",
    marginRight: 4,
  },
  subtitle: {
    fontStyle: "italic",
    fontSize: 10,
  },
  description: {
    fontSize: 12,
  },
  link: {
    fontSize: 10,
    textDecoration: "underline",
    marginRight: 4,
  },
});

const ProjectEntry = ({ title, subtitle, description, startDate, endDate, links }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row} wrap={false}>
        <View style={styles.leftColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {links?.length > 0 &&
              links.map((link, idx) => (
                <Text
                  key={idx}
                  style={styles.link}
                  render={({ pageNumber }) =>
                    `${platformSymbols[link.platform] || "🔗"}`
                  }
                />
              ))}
          </View>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.rightColumn}>
          <Text>
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>
      </View>

      {description && (
        <View style={styles.description}>
          <HTML style={styles.description}>{description}</HTML>
        </View>
      )}
    </View>
  );
};

// Date formatter for PDF version
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
}

export default ProjectEntry;
