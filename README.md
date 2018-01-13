WIP

## Motivation

Why another form library for react/redux ecosystem? Main reasons are:

* First class TypeScript support (fully written in TypeScript).
* Expose API as Redux action creators and selector instead of React components (or HOC)

One of the main pain points of other libraries are:

* They treat Redux part as second class and it is extremely hard to use them without HOC and helper components.
* Storage structure seems to be more complicated then it should be e.g. too many dependent data is stored instead of computed in selectors.
* Too many vague actions are dispatched so it is hard to keep track what's going on.
