# Buche

Buche is login and register form components library for angular.

It tries to provide the best ux for login and register with minimal pain.

## Installation

``` bash
bower install --save https://github.com/FranzPoize/buche.git#~0.0.1
```

In your app you'll have to add the buche module as a dependency

``` javascript
angular.module('yourModule',['buche']);
```

## Login directive

The login directive appropriately named `buche-login` provides a single template.

### Usage

Append a `buche-login` attributes to an empty element to activate the directive
``` html
<div 
  buche-login buche-login-cb="login" 
  buche-login-no-tooltip="true"
  buche-password-no-tooltip="true"
  buche-no-tooltip="true"
  buche-forgot-password-text="Did you forgot your password ?"
  buche-forgot-username-text="Tough luck !"
  buche-forgot-username-link="http://google.com/" 
  buche-forgot-password-link="http://yahoo.fr/"
  buche-login-tooltip-placement="right"
  buche-login-tooltip-text="Yo !"
  buche-password-tooltip-placement="left"
  buche-password-tooltip-text="Just to mess with ya.">
</div>
```

|Name|Type|default|description|
|----|----|-------|-----------|
|buche-login-cb|string|bucheLogin|Name of the callback used when submitting the form. This callback must be define in the `$scope` where the directive is used|
|buche-no-tooltip|boolean|false|Specifies whether or not password and login tooltips should be displayed. Tooltips will not be displayed if it's `false`.|
|buche-login-no-tooltip|boolean|false|Specifies whether or not the login tooltip should be displayed|
|buche-password-no-tooltip|boolean|false|Specifies wheter or not the password tooltip should be displayed|
|forgot-password-text|string|Forgotten your password ?|Text displayed in the link under the password input field|
|forgot-password-link|string|none|Target of the forgotten password link|
|forgot-login-text|string|Forgotten your username ?| Text displayed in the link under the username input field|
|forgot-username-link|string|none|Target of the forgotten username link|
|buche-login-tooltip-placement|string|right|Placement of the login bootstrap tooltip. Must be `top`,`right`,`bottom` or `left`|
|buche-password-tooltip-placement|string|right|Placement of the password bootstrap tooltip. Must be `top`,`right`,`bottom` or `left`|
|buche-login-tooltip-text|string|Tooltip text|Text shown in the login tooltip|
|buche-password-tooltip-text|string|Tooltip text|Text shown in the password tooltip|

## Register directive

The register directive appropriately named `buche-register` provides a single template.

### Usage

Append a `buche-register` attributes to an empty element to activate the directive.
``` html
<div
  buche-register
  buche-register-cb="register"
  buche-password-length="8"
  buche-security-check="checkPassword"
  buche-login-tooltip-placement="right"
  buche-login-tooltip-text="Yo !"
  buche-password-tooltip-placement="left"
  buche-password-tooltip-text="Just to mess with ya."
  buche-no-confirm="true">
```

|Name|Type|default|description|
|----|----|-------|-----------|
|buche-register-cb|string|bucheRegister|Name of the callback used when submitting the register form. This callback must be define in the `$scope` where the directive is used|
|buche-password-length|integer|8|Length used to check wether the password is long enough or not|
|buche-security-check|function|`function() { return false;}`| Callback used to check the password for security concerns. Must return `true` if the password is not secured enough|
|buche-login-tooltip-placement|string|right|Placement of the login bootstrap tooltip. Must be `top`,`right`,`bottom` or `left`|
|buche-password-tooltip-placement|string|right|Placement of the password bootstrap tooltip. Must be `top`,`right`,`bottom` or `left`|
|buche-login-tooltip-text|string|Tooltip text|Text shown in the login tooltip|
|buche-password-tooltip-text|string|Tooltip text|Text shown in the password tooltip|
