import { Text, View, StyleSheet } from '@react-pdf/renderer';

const Section = ({ title, type = "simple", children }) => {
  const baseHeading = (
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{title}</Text>
  );

  switch (type) {
    case 'underline':
      return (
        <View style={{ marginTop: 10 }}>
          {baseHeading}
          <View style={{ borderBottomWidth: 2, borderColor: 'black', width: 'fit-content', marginBottom: 4 }} />
          {children}
        </View>
      );

    case 'line':
      return (
        <View style={{ marginTop: 10 }}>
          {baseHeading}
          <View style={{ borderBottomWidth: 2, borderColor: 'black', marginBottom: 4 }} />
          {children}
        </View>
      );

    case 'simple':
      return (
        <View style={{ marginTop: 10 }}>
          {baseHeading}
          {children}
        </View>
      );

    case 'thickShortUnderline':
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
          <View style={{ borderBottomWidth: 5, borderColor: 'black', width: 40, marginBottom: 4 }} />
          {children}
        </View>
      );

    case 'zigZagLine':
      return (
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 2 }}>{title}</Text>
          <View
            style={{
              height: 6,
              marginBottom: 4,
              backgroundColor: 'black',
              opacity: 0.05 // since SVG background-image is not supported in PDF, we simulate a zigzag
            }}
          />
          {children}
        </View>
      );

    case 'topBottomLine':
      return (
        <View style={{ marginTop: 10 }}>
          <View style={{ borderBottomWidth: 2, borderColor: 'black' }} />
          <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
          <View style={{ borderBottomWidth: 2, borderColor: 'black', marginBottom: 4 }} />
          {children}
        </View>
      );

    case 'box':
      return (
        <View style={{ marginTop: 10 }}>
          <View style={{ backgroundColor: '#00000010', padding: 4, marginBottom: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
          </View>
          {children}
        </View>
      );

    default:
      return (
        <View style={{ marginTop: 10 }}>
          {baseHeading}
          {children}
        </View>
      );
  }
};

export default Section;
