/* eslint-disable no-console */
import 'rc-cascader/assets/index.less';
import Cascader from 'rc-cascader';
import React from 'react';
import ReactDOM from 'react-dom';

const addressOptions = [{
  'label': '福建',
  'value': 'fj',
  'children': [{
    'label': '福州',
    'value': 'fuzhou',
    'children': [{
      'label': '马尾',
      'value': 'mawei',
    }],
  }, {
    'label': '泉州',
    'value': 'quanzhou',
  }],
}, {
  'label': '浙江',
  'value': 'zj',
  'children': [{
    'label': '杭州',
    'value': 'hangzhou',
    'children': [{
      'label': '余杭',
      'value': 'yuhang',
    }],
  }],
}, {
  'label': '北京',
  'value': 'bj',
  'children': [{
    'label': '朝阳区',
    'value': 'chaoyang',
  }, {
    'label': '海淀区',
    'value': 'haidian',
  }],
}];

const Demo = React.createClass({
  getInitialState() {
    return {
      inputValue: '',
    };
  },
  onChange(value, selectedOptions) {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  },
  render() {
    return (
      <Cascader options={addressOptions} onChange={this.onChange} transitionName="slide-up">
        <input value={this.state.inputValue} readOnly />
      </Cascader>
    );
  },
});

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
