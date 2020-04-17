const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID, GraphQLList } = graphql;

const User = require('../models/User');
const Item = require('../models/item');
const jwt = require('jsonwebtoken');

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                User.findById(parent.id);
            }
        },
        quantity: {
            type: GraphQLInt
        },
        price: {
            type: GraphQLString
        },
        discount: {
            type: GraphQLInt
        }

    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => (
        {
            id: {
                type: GraphQLID
            },
            email: {
                type: GraphQLString
            },
            phone:{
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            avatar: {
                type: GraphQLString
            },
            authToken: {
                type: GraphQLString,
                resolve(parent, args) {
                    let token = jwt.sign({ id: parent.id }, 'sih2020');
                    return token
                }
            },
            items: {
                type: new GraphQLList(ItemType),
                async resolve(parent, args) {
                    let list = await User.findById({ _id: parent.id }).populate('items');
                    return list.items;
                }
            }
        }
    )
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        item: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args) {
                let item = await Item.findById({ _id: args.id });
                return item;
            }
        },
        user: {
            type: UserType,
            args: { phone: { type: GraphQLString }},
            async resolve(parent, args) {
                let user = await User.findOne({ phone: args.phone});
                return user
            }
        },
        farmers:{
                type: new GraphQLList(UserType),
                async resolve(parent, args){
                    let farmers = await User.findOne({role:'Farmer'});
                    return farmers;
                }
        },
        farmer:{
            type:UserType,
            args: {id:{type: GraphQLID }},
            async resolve(parent, args){
                let farmer = await User.findById(args.id);
                return farmer;
            }
    },

        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args,context) {
                console.log(context.headers.authorization);
                let users = await User.find({});
                return users;
            }
        },
        items: {
            type: new GraphQLList(ItemType),
            async resolve(parent, args) {
                let items = await Item.find({});
                return items;
            }
        }
    }
});

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                emailOrPhone: { type: GraphQLString },
                password: { type: GraphQLString },
                address: { type: GraphQLString },
                role: { type: GraphQLString }
            },
            async resolve(parent, args) {
                console.log('hey');
                let user = await User.create({
                    first_name: args.name,
                    emailOrPhone: args.emailOrPhone,
                    password: args.password,
                    last_name:args.last_name,
                    role:args.role,
                    address:args.address
                });
                return user;
            }
        },
        addItem: {
            type: ItemType,
            args: {
                title: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                userId: { type: GraphQLID }
            },
            async resolve(parent, args) {
                let item = await Item.create({
                    title: args.title,
                    quantity: args.quantity,
                    user: args.userId
                });
                let user = await User.findById({ _id: args.userId });
                await user.items.push(item._id);
                user.save();
                return item;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations
});