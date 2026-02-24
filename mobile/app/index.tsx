import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    <View style={styles.container}>
      
      <View style={styles.box1} />

      <Text style={styles.text}>
        Hello, I am your friend!
      </Text>

      {/* Tableau simulé */}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>1</Text>
          <Text style={styles.cell}>2</Text>
          <Text style={styles.cell}>3</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.cell}>4</Text>
          <Text style={styles.cell}>5</Text>
          <Text style={styles.cell}>6</Text>
        </View>
      </View>

      <View style={styles.box2} />
      <View style={styles.box3} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box1: {
    flex: 1,
    backgroundColor: 'powderblue',
  },
  box2: {
    flex: 2,
    backgroundColor: 'skyblue',
  },
  box3: {
    flex: 3,
    backgroundColor: 'steelblue',
  },
  text: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  table: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
  },
});

export default FlexDimensionsBasics;