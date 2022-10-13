import type { ComponentMeta, ComponentStory } from '@storybook/react';

import Icon from './Icon';

const Template: ComponentStory<typeof Icon> = props => (
  <Icon {...props}>
    <path d="M56.1537,18.5615l.9088,1.8415c.025,.0506,.0732,.0857,.1291,.0938l2.0322,.2953c.1406,.0204,.1968,.1932,.095,.2924l-1.4705,1.4334c-.0404,.0394-.0588,.0961-.0493,.1517l.3471,2.024c.024,.14-.123,.2468-.2487,.1807l-1.8177-.9556c-.0499-.0263-.1096-.0263-.1595,0l-1.8177,.9556c-.1258,.0661-.2728-.0407-.2487-.1807l.3471-2.024c.0095-.0556-.0089-.1124-.0493-.1517l-1.4705-1.4334c-.1017-.0992-.0456-.272,.095-.2924l2.0322-.2953c.0558-.0081,.1041-.0432,.1291-.0938l.9088-1.8415c.0629-.1274,.2446-.1274,.3075,0Zm-.1537-2.5615c-3.3137,0-6,2.6863-6,6s2.6863,6,6,6,6-2.6863,6-6-2.6863-6-6-6Zm3.89-6l-2.31,4.15c1.83,.37,3.44,1.37,4.58,2.75l3.84-6.9h-6.11Zm-13.89,0l3.84,6.9c1.14-1.38,2.75-2.38,4.58-2.75l-2.31-4.15h-6.11Z" />
  </Icon>
);

export default {
  component: Icon
} as ComponentMeta<typeof Icon>;
export const Example = Template.bind({});
export const Sm = Template.bind({});
export const Md = Template.bind({});
export const Lg = Template.bind({});

Example.args = {
  accessible: true,
  size: 'lg'
};
