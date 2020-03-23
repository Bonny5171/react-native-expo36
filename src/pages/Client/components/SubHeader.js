import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { IconActionless as IA, Row, TextLimit } from '../../../components';
import { Font } from '../../../assets/fonts/font_names';
import AccountDb from '../../../services/Account';
class SubHeader extends React.Component {
  constructor(props) {
    super(props);
    this.maxNameLength = 23;
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.reason !== nextProps.reason) {
      return true;
    }
    if (this.props.next !== nextProps.next) {
      return true;
    }
    if (this.props.previous !== nextProps.previous) {
      return true;
    }
    return false;
  }
  render() {
    const {
      reason,
      data,
      previous,
      client,
      next,
      context,
      acNextClient,
      acPreviousClient
    } = this.props;
    const arrow = (<IA style={{ fontSize: 10 }} msg="v" />);
    return (
      <View style={styles.container}>
        <Row style={{ alignItems: 'center' }}>
          <Text style={styles.txtSubTitle}>CLIENTES {arrow} DIAMANTE {arrow} {reason !== undefined ? reason.toUpperCase() : ''}</Text>
          {/*
            <NextPrev
              context={context}
              previous={previous}
              client={client}
              next={next}
              data={data}
              acPreviousClient={acPreviousClient}
              acNextClient={acNextClient}
            />
          */}
        </Row>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  data: state.clients.data,
  previous: state.clients.previous,
  // previousPointer: state.clients.previous,
  client: state.clients.client,
  next: state.clients.next,
  // nextPointer: state.clients.next,
});

export default connect(mapStateToProps, null)(SubHeader);

const styles = StyleSheet.create({
  container: {
    height: 70,
    justifyContent: 'center',
    marginTop: 7,
    // paddingBottom: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: Font.AMedium
  },
  txtSubTitle: {
    flex: 1,
    color: '#333',
    fontFamily: Font.ALight,
    marginLeft: 30,
    marginBottom: 35
  },
  icCart: {
    fontSize: 35,
    color: '#999',
    marginRight: 40,
    marginTop: 20
  },
  vwNextClient: {
    alignSelf: 'flex-end',
    height: 40,
    width: 300,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(240, 240, 240)',
    borderRadius: 20,
    paddingHorizontal: 3,
    marginRight: 25,
    marginBottom: 40,
  },
  txtClient: {
    fontSize: 20,
  },
  tchbClient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 35,
    width: 140,
  },
  txtNextPrev: {
    color: '#9CC0C5',
    textAlign: 'center',
    width: 90,
    marginLeft: 15
  }
});


const NextPrev = ({ context, previous, next, acPreviousClient, acNextClient }) => {
  if (context !== 'Admin') return null;
    return (
      <View style={styles.vwNextClient}>
        <TouchableOpacity
          style={styles.tchbClient}
          onPress={async () => {
            const previousClient = await AccountDb.getById(previous.key);
            acPreviousClient(previousClient);
          }}
        >
          <IA style={[styles.txtClient, { transform: [{ rotate: '180deg' }], color: '#999' }]} msg="v" />
          <TextLimit
            style={[styles.text, styles.txtNextPrev]}
            msg={previous.fantasyName !== undefined ? previous.fantasyName.toUpperCase() : '[nulo]'}
            maxLength={16}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tchbClient}
          onPress={async () => {
            const nextClient = await AccountDb.getById(next.key);
            acNextClient(nextClient);
          }}
        >
          <TextLimit
            style={[styles.text, styles.txtNextPrev]}
            msg={next.fantasyName !== undefined ? next.fantasyName.toUpperCase() : '[nulo]'}
            maxLength={16}
          />
          <IA style={[styles.txtClient, { color: '#999', marginLeft: 15 }]} msg="v" />
        </TouchableOpacity>
      </View>
    );
};