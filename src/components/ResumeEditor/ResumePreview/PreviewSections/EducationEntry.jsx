import { View, Text } from "@react-pdf/renderer";
import Html from "react-pdf-html";

const EducationEntry = ({ title, subtitle, location, grade, date, description, style }) => {
  const isSchoolDegree = 'school-degree';

  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          {isSchoolDegree ? (
            <>
              <Text>{subtitle}</Text>
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            </>
          ) : (
            <>
              <Text style={{ fontWeight: 'bold' }}>{title}</Text>
              <Text>{subtitle}</Text>
            </>
          )}
        </View>
        <View style={{ textAlign: 'right' }}>
          {grade && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Text>{grade}</Text>
            </View>
          )}
          <Text>{date}{location ? ` | ${location}` : ''}</Text>
        </View>
      </View>
      {description && <Html style={{ fontSize: 12 }}>{description}</Html>}
    </View>
  );
};

export default EducationEntry;