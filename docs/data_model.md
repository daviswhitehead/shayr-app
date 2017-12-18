# Tables

### posts
**Description**  
Data related to content only, agnostic of user actions

Core
- id
- url
- created_at
- updated_at

MVP
- medium
- icon
- title
- summary

PP
- consumption_time

LT

#### users
**Description**

Core
- id
- email
- name
- facebook token
- google token
- created_at
- updated_at


#### shares
**Description**

Core
- id
- url
- post_id
- user_id
- created_at
- updated_at

PP
- medium
- mention
- comment

LT
- tags


#### attributes
**Description**
PP structure. relates users to additional attributes

attributes
- id
- attribute_name
- created_at
- updated_at
- meta

user_attributes
- id
- user_id
- attribute_id
- created_at
- updated_at

#### notes
- how do you handle slightly different urls from shares?
  - map shares to a post based on url matching