import * as React from 'react';
import { expect, assert } from 'chai';
import { createMount, getClasses, findOutermostIntrinsic } from '@material-ui/core/test-utils';
import describeConformance from '../test-utils/describeConformance';
import KeyboardArrowLeft from '../internal/svg-icons/KeyboardArrowLeft';
import KeyboardArrowRight from '../internal/svg-icons/KeyboardArrowRight';
import Paper from '../Paper';
import Button from '../Button/Button';
import LinearProgress from '../LinearProgress';
import MobileStepper from './MobileStepper';

describe('<MobileStepper />', () => {
  let mount;
  let classes;
  const defaultProps = {
    steps: 2,
    nextButton: (
      <Button aria-label="next">
        Next
        <KeyboardArrowRight />
      </Button>
    ),
    backButton: (
      <Button aria-label="back">
        <KeyboardArrowLeft />
        Back
      </Button>
    ),
  };

  before(() => {
    mount = createMount({ strict: true });
    classes = getClasses(<MobileStepper {...defaultProps} />);
  });

  after(() => {
    mount.cleanUp();
  });

  describeConformance(<MobileStepper {...defaultProps} />, () => ({
    classes,
    inheritComponent: Paper,
    mount,
    refInstanceof: window.HTMLDivElement,
    skip: ['componentProp'],
  }));

  it('should render a Paper with 0 elevation', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} />);
    expect(wrapper.find(Paper).props().elevation).to.equal(0);
  });

  it('should render with the bottom class if position prop is set to bottom', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} position="bottom" />);
    expect(findOutermostIntrinsic(wrapper).hasClass(classes.positionBottom)).to.equal(true);
  });

  it('should render with the top class if position prop is set to top', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} position="top" />);
    expect(findOutermostIntrinsic(wrapper).hasClass(classes.positionTop)).to.equal(true);
  });

  it('should render two buttons', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} />);
    assert.lengthOf(wrapper.find(Button), 2);
  });

  it('should render the back button', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} />);
    const backButton = wrapper.find('button[aria-label="back"]');
    expect(backButton.exists()).to.equal(true);
    assert.lengthOf(backButton.find('svg[data-mui-test="KeyboardArrowLeftIcon"]'), 1);
  });

  it('should render next button', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} />);
    const nextButton = wrapper.find('button[aria-label="next"]');
    expect(nextButton.exists()).to.equal(true);
    assert.lengthOf(nextButton.find('svg[data-mui-test="KeyboardArrowRightIcon"]'), 1);
  });

  it('should render two buttons and text displaying progress when supplied with variant text', () => {
    const wrapper = mount(
      <MobileStepper {...defaultProps} variant="text" activeStep={1} steps={3} />,
    );
    expect(findOutermostIntrinsic(wrapper).instance().textContent).to.equal('Back2 / 3Next');
  });

  it('should render dots when supplied with variant dots', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} variant="dots" />);
    const outermost = findOutermostIntrinsic(wrapper);
    assert.lengthOf(outermost.children(), 3);
    expect(outermost.childAt(1).hasClass(classes.dots)).to.equal(true);
  });

  it('should render a dot for each step when using dots variant', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} variant="dots" />);
    assert.lengthOf(wrapper.find(`.${classes.dot}`), 2);
  });

  it('should render the first dot as active if activeStep is not set', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} variant="dots" />);
    expect(
      findOutermostIntrinsic(wrapper).childAt(1).childAt(0).hasClass(classes.dotActive),
    ).to.equal(true);
  });

  it('should honor the activeStep prop', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} variant="dots" activeStep={1} />);
    expect(
      findOutermostIntrinsic(wrapper).childAt(1).childAt(1).hasClass(classes.dotActive),
    ).to.equal(true);
  });

  it('should render a <LinearProgress /> when supplied with variant progress', () => {
    const wrapper = mount(<MobileStepper {...defaultProps} variant="progress" />);
    assert.lengthOf(wrapper.find(LinearProgress), 1);
  });

  it('should calculate the <LinearProgress /> value correctly', () => {
    let wrapper = mount(<MobileStepper {...defaultProps} variant="progress" steps={3} />);
    let linearProgressProps = wrapper.find(LinearProgress).props();
    expect(linearProgressProps.value).to.equal(0);

    wrapper = mount(
      <MobileStepper {...defaultProps} variant="progress" steps={3} activeStep={1} />,
    );
    linearProgressProps = wrapper.find(LinearProgress).props();
    expect(linearProgressProps.value).to.equal(50);

    wrapper = mount(
      <MobileStepper {...defaultProps} variant="progress" steps={3} activeStep={2} />,
    );
    linearProgressProps = wrapper.find(LinearProgress).props();
    expect(linearProgressProps.value).to.equal(100);
  });
});
