import React from "react";
import { View, Text, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  leftColumn: {
    flexDirection: "column",
    flexGrow: 1,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 12,
  },
  link: {
    fontSize: 12,
    color: "blue",
    textDecoration: "underline",
  },
  issuer: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    textAlign: "right",
    whiteSpace: "nowrap",
  },
});

const AwardEntry = ({ title, link, date, issuer }) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <View style={styles.leftColumn}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {/* {link && (
            <Link src={link} style={styles.link}>
              🔗
            </Link>
          )} */}
        </View>
        {issuer && <Text style={styles.issuer}>{issuer}</Text>}
      </View>
      {date && <Text style={styles.date}>{date}</Text>}
    </View>
  </View>
);

export default AwardEntry;
