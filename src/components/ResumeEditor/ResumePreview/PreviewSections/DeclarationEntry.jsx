import { View, Text, Image } from "@react-pdf/renderer";
import { format } from "date-fns"; // Make sure you format the date before passing or use a util

const DeclarationEntry = ({ text, signature, date, place }) => {
  const formattedDate = date ? format(new Date(date), "dd MMMM yyyy") : "";

  return (
    <View style={{ marginTop: 10, gap: 6 }}>
      <Text>{text}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
        <View>
          <Text>Date: {formattedDate}</Text>
          <Text>Place: {place}</Text>
        </View>

        {signature && (
          <View style={{ alignItems: "center" }}>
            <Image
              src={signature}
              style={{ width: 80, height: 40, objectFit: "contain" }}
            />
            <Text>Signature</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DeclarationEntry;