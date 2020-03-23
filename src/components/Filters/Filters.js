import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { func, array, bool, string, number } from 'prop-types';
import { Font } from '../../assets/fonts/font_names';
import { arrayIntoGroups } from '../../redux/reducers/pages/common/functions';
import global from '../../assets/styles/global';
import { DisableComponent } from '..';
class Filters extends Component {
  state = {
    filters: []
  };

  componentDidMount() {
    this.showStackedFilters(this.props.filters, true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currStack !== this.props.currStack || prevProps.filters !== this.props.filters) {
      // console.log('this.props.filters', this.props.filters);
      this.showStackedFilters(this.props.filters);
    }
  }

  render() {
    const { hasTitle, title, current, chooseFilter, name } = this.props;
    if (this.state.filters.length === 0) return null;
    const hasMoreOptions = this.props.filters.length !== this.state.filters.length;
    return (
      <View style={this.props.containerStyle}>
        <Title
          isVisible={hasTitle}
          title={title}
        />
        <View style={[styles.content, this.props.contentStyle]}>
          {
            this.state.filters.map((filter, index) => (
              <Filter
                key={index.toString()}
                isChosen={filter.option === current}
                filter={filter}
                chooseFilter={() => chooseFilter(filter, index, name)}
              />
            ))
          }
          {
            hasMoreOptions &&
            (
              <TouchableOpacity
                disabled={!hasMoreOptions}
                style={styles.tchbExpand}
                onPress={this.showMoreFilters}
              >
                <Text style={[styles.icExpand, global.activeBtnShadow]}>...</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    );
  }

  showMoreFilters = () => {
    this.props.setFilterStack('add', this.props.pointerFilter);
  }

  showStackedFilters(newFilters, isInitial) {
    this.pagedFilters = arrayIntoGroups(newFilters, this.props.filtersPerPage);

    if (isInitial && this.props.current === '' && this.pagedFilters[0]) {
      this.setState({ filters: [...this.pagedFilters[0]] });
    } else {
      this.setState({ filters: this.props.filters });
    }
  }
}
export default Filters;

Filters.propTypes = {
  chooseFilter: func.isRequired,
  filters: array.isRequired,
  hasTitle: bool,
  title: string,
  filtersPerPage: number,
};

Filters.defaultProps = {
  filtersPerPage: 5,
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  txtTitle: {
    fontFamily: Font.ASemiBold,
    fontSize: 11,
    marginBottom: 6,
  },
  tchbExpand: {
    alignSelf: 'center',
    marginLeft: 2
  },
  icExpand: {
    fontSize: 19,
    transform: [{ translateY: -6.5 }]
  }
});

const Filter = ({ isChosen, filter, chooseFilter }) => (
  <TouchableOpacity
    onPress={chooseFilter}
    style={[stylesFilter.container, isChosen && stylesFilter.containerChosen]}
  >
    <Text style={[stylesFilter.txt, isChosen && stylesFilter.txtChosen]}>{filter.option.toUpperCase()}</Text>
  </TouchableOpacity>
);

const stylesFilter = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#EEE',
    borderColor: '#999',
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  containerChosen: {
    backgroundColor: '#0085B2',
  },
  txt: {
    fontFamily: Font.AMedium,
    fontSize: 11,
  },
  txtChosen: {
    color: 'white'
  },
});


const Title = ({ isVisible, title }) => {
  if (!isVisible) return null;
  return (
    <Text style={styles.txtTitle}>{title}</Text>
  );
};