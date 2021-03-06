import React from 'react';
import arrayTreeFilter from 'array-tree-filter';
import { findDOMNode } from 'react-dom';

class Menus extends React.Component {
  componentDidMount() {
    this.scrollActiveItemToView();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scrollActiveItemToView();
    }
  }

  onSelect(targetOption, menuIndex) {
    if (!targetOption || targetOption.disabled) {
      return;
    }
    let activeValue = this.props.activeValue;
    activeValue = activeValue.slice(0, menuIndex + 1);
    activeValue[menuIndex] = targetOption.value;
    const activeOptions = this.getActiveOptions(activeValue);
    if (targetOption.isLeaf === false && !targetOption.children && this.props.loadData) {
      this.props.onSelect({ activeValue });
      this.props.loadData(activeOptions);
      return;
    }
    const onSelectArgument = {};
    if (!targetOption.children || !targetOption.children.length) {
      this.props.onChange(activeOptions, { visible: false });
      // set value to activeValue when select leaf option
      onSelectArgument.value = activeValue;
    } else if (this.props.changeOnSelect) {
      this.props.onChange(activeOptions, { visible: true });
      // set value to activeValue on every select
      onSelectArgument.value = activeValue;
    }
    onSelectArgument.activeValue = activeValue;
    this.props.onSelect(onSelectArgument);
  }

  getOption(option, menuIndex) {
    const { prefixCls, expandTrigger } = this.props;
    const onSelect = this.onSelect.bind(this, option, menuIndex);
    let expandProps = {
      onClick: onSelect,
    };
    let menuItemCls = `${prefixCls}-menu-item`;
    if (expandTrigger === 'hover' &&
      option.children &&
      option.children.length > 0) {
      expandProps = {
        onMouseEnter: this.delayOnSelect.bind(this, onSelect),
        onMouseLeave: this.delayOnSelect.bind(this),
      };
      menuItemCls += ` ${prefixCls}-menu-item-expand`;
    }
    if (this.isActiveOption(option)) {
      menuItemCls += ` ${prefixCls}-menu-item-active`;
      expandProps.ref = 'activeItem' + menuIndex;
    }
    if (option.disabled) {
      menuItemCls += ` ${prefixCls}-menu-item-disabled`;
    }
    let title = '';
    if (option.title) {
      title = option.title;
    } else if (typeof option.label === 'string') {
      title = option.label;
    }
    return (
      <li key={option.value}
        className={menuItemCls}
        title={title}
        {...expandProps}>
        {option.label}
      </li>
    );
  }

  getActiveOptions(values) {
    const activeValue = values || this.props.activeValue;
    const options = this.props.options;
    return arrayTreeFilter(options, (o, level) => o.value === activeValue[level]);
  }

  getShowOptions() {
    const { options } = this.props;
    const result = this.getActiveOptions()
      .map(activeOption => activeOption.children)
      .filter(activeOption => !!activeOption);
    result.unshift(options);
    return result;
  }

  delayOnSelect(onSelect) {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
    if (typeof onSelect === 'function') {
      this.delayTimer = setTimeout(() => {
        onSelect();
        this.delayTimer = null;
      }, 150);
    }
  }

  scrollActiveItemToView() {
    // scroll into view
    const optionsLength = this.getShowOptions().length;
    for (let i = 0; i < optionsLength; i++) {
      const itemComponent = this.refs['activeItem' + i];
      if (itemComponent) {
        const target = findDOMNode(itemComponent);
        target.parentNode.scrollTop = target.offsetTop;
      }
    }
  }

  isActiveOption(option) {
    return this.props.activeValue.some(value => value === option.value);
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div>
        {this.getShowOptions().map((options, menuIndex) =>
          <ul className={`${prefixCls}-menu`} key={menuIndex}>
            {options.map(option => this.getOption(option, menuIndex))}
          </ul>
        )}
      </div>
    );
  }
}

Menus.defaultProps = {
  options: [],
  value: [],
  activeValue: [],
  onChange() {
  },
  onSelect() {
  },
  prefixCls: 'rc-cascader-menus',
  visible: false,
  expandTrigger: 'click',
  changeOnSelect: false,
};

Menus.propTypes = {
  value: React.PropTypes.array,
  activeValue: React.PropTypes.array,
  options: React.PropTypes.array.isRequired,
  prefixCls: React.PropTypes.string,
  expandTrigger: React.PropTypes.string,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  loadData: React.PropTypes.func,
  visible: React.PropTypes.bool,
  changeOnSelect: React.PropTypes.bool,
};

export default Menus;
