import { View, Text, Link } from "@react-pdf/renderer";
import { LinkIcon } from "lucide-react"; // This will not render in PDF. Consider using a unicode or omit.

const ReferenceEntry = ({ name, jobTitle, organization, link, email, phone }) => (
  <View style={{ marginBottom: 6 }}>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
      <Text>
        <Text style={{ fontWeight: "bold" }}>{name}</Text>, {jobTitle}, {organization}
      </Text>
      {/* {link && (
        <Link src={link} style={{ textDecoration: "underline", marginLeft: 4 }}>
          🔗
        </Link>
      )} */}
    </View>

    {(email || phone) && (
      <Text>{[email, phone].filter(Boolean).join(", ")}</Text>
    )}
  </View>
);

export default ReferenceEntry;