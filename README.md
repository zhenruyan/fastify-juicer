#  fastify-juicer

[简体中文](https://github.com/PaulGuo/Juicer)

##  Install


```
npm install fastify-juicer --save

```

##  Usage

```
const fastify = require('fastify')()

fastify.register(require('fastify-juicer'))

fastify.get('/', (req, reply) => {
  reply.view('/templates/index.html', { text: 'text' })
})

fastify.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${fastify.server.address().port}`)
})
```

If you want to set a fixed templates folder, or pass some options to the template engines:

```
fastify.register(require('point-of-view'), {
  templates: 'templates',
  includeViewExtension:"html"
})

```


#  How to use

> Compile the template and render the result immediately based on the given data.

```
fastify.get('/', (req, reply) => {
  reply.view('/templates/index.html', { text: 'text' })
})

```

#  Syntax

> Use ${} to output variable values, where _ is a reference to the data source (such as ${_}, often used for data source arrays). Supports custom functions (you can implement many interesting functions with custom functions, like ${data|links} You can assemble the data directly with the <a Href= by defining a predefined custom function links "..." alt= "..."/>).


```
${name}
${name|function}
${name|function, arg1, arg2}

```

Let's illustrate the amazing use of custom functions with an example.

```
var json = {
	links: [
		{href: 'http://juicer.name', alt: 'Juicer'},
		{href: 'http://benben.cc', alt: 'Benben'},
		{href: 'http://ued.taobao.com', alt: 'Taobao UED'}
	]
};

var tpl = [
	'{@each links as item}',
		'${item|links_build} <br />',
	'{@/each}'
].join('');

var links = function(data) {
	return '<a href="' + data.href + '" alt="' + data.alt + '" />';
};


```

juicer.register('links_build', links); //Registering a custom function
  juicer(tpl, json);




After the above code executes we will find that the result is this:

```

&lt;a href=&quot;http://juicer.name&quot; alt=&quot;Juicer&quot; <br />
&lt;a href=&quot;http://benben.cc&quot; alt=&quot;Benben&quot; <br />
&lt;a href=&quot;http://ued.taobao.com&quot; alt=&quot;Taobao UED&quot; <br />

```

As you can see, the result is escaped, and if we use $${item|links} we will get the result we expected, which is the avoidance of escaping that is going to be mentioned below.

Escape/Avoid escaping

For security reasons, the ${variable} escapes its contents before the output, and if you do not want the output to be escaped, you can use the $${variable} to avoid this situation. For example:


```
var json = {
	value: '&lt;strong&gt;juicer&lt;/strong&gt;'
};

var escape_tpl='${value}';
var unescape_tpl='$${value}';

juicer(escape_tpl, json); //Output '&lt;strong&gt;juicer&lt;/strong&gt;'
juicer(unescape_tpl, json); //Output '<strong>juicer</strong>'

```



###  Loop traversal   {@each} ... {@/each}

If you need to iterate over the array, you can use each one like this.

```
{@each list as item}
	${item.prop}
{@/each}

```

It is also handy if you want to get the current index value during traversal.


```
{@each list as item, index}
	${item.prop}
	${index} //now  index
{@/each}

```


###   Determine {@if} ... {@else if} ... {@else} ... {@/if}


We also often encounter the logical judgment of the data.


```
{@each list as item,index}
	{@if index===3}
		the index is 3, the value is ${item.prop}
	{@else if index === 4}
		the index is 4, the value is ${item.prop}
	{@else}
		the index is not 3, the value is ${item.prop}
	{@/if}
{@/each}

```

###  Comment {# comment content}


 For the maintainability and readability of subsequent code, we can add annotations to the template.

{# Here is the comment content}


###  Secondary loop  {@each i in range(m, n)}

The secondary loop is a juicer for you, and maybe you'll need it in some kind of situation.


```
{@each i in range(5, 10)}
	${i}; //输出 5;6;7;8;9;
{@/each}

```

###  Child template Nesting   {@include tpl, data}

Child template nesting allows you to organize your template code in a more flexible manner, except that you can introduce templates that are specified in the data, but you can also use the template code written in the script tag by specifying the string #id.


> html code


```
<script type="text/juicer" id="subTpl">
	I'm sub content, ${name}
</script>

```

>  js code

```
var tpl = 'Hi, {@include "#subTpl", subData}, End.';

juicer(tpl, {
	subData: {
		name: 'juicer'
	}
});

//output Hi, I'm sub content, juicer, End.
//or by introducing a child template with data, the following code will have the same render result:
 

var tpl = 'Hi, {@include subTpl, subData}, End.';

juicer(tpl, {
	subTpl: "I'm sub content, ${name}",
	subData: {
		name: 'juicer'
	}
});

```


###    A complete example


```
HTML code:

<script id="tpl" type="text/template">
	<ul>
		{@each list as it,index}
			<li>${it.name} (index: ${index})</li>
		{@/each}
		{@each blah as it}
			<li>
				num: ${it.num} <br />
				{@if it.num==3}
					{@each it.inner as it2}
						${it2.time} <br />
					{@/each}
				{@/if}
			</li>
		{@/each}
	</ul>
</script>

Javascript code:

var data = {
	list: [
		{name:' guokai', show: true},
		{name:' benben', show: false},
		{name:' dierbaby', show: true}
	],
	blah: [
		{num: 1},
		{num: 2},
		{num: 3, inner:[
			{'time': '15:00'},
			{'time': '16:00'},
			{'time': '17:00'},
			{'time': '18:00'}
		]},
		{num: 4}
	]
};


fastify.get('/', (req, reply) => {
  reply.view('/templates/index.html', data)
})


```