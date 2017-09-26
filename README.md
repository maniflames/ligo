# Ligo

At the moment Ligo is in development.
I bumped into some things I had to solve related to the school assignment.
I keep a very detailed desciption of these things in my Wiki.
I'll give a brief overview of them right here

#### Waterline ORM & MongoDB Lazy Loading
The .populate() function that belongs to the Waterline ORM creates joins.
Because MongoDB doesn't have a joins functionallity it automatically
falls back on a polyfill that artifically joins values. Unfortunately this polyfill
sends multiplue request in orderto achieve this.

naitive $lookup query

#### Why I switched from MongoDB to SQL
1) no eager support waterline
2) no eager support mongoose
3) time
4) thw goal

#### ACL
 I used policies

#### Lean controllers
 I am going to use services

#### LESS > SASS
 Used to sass so I might replace Less (depents on how awesome my imported library is)

#### Loading stylesheets
 I am going to run the grunt tasks & sails-linker stuff with views

#### URL's in views
used sails.getUrlFor(contoller.action)

#### Debugging
sails.log.error
sails.log.debug
were extremly helpfull when debugging server side issues
