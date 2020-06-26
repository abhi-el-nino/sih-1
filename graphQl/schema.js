const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const User = require("../models/User");
const Item = require("../models/item");
const Farmer = require("../models/Farmer");
const Complaint = require("../models/Complaint");
const {ObjectId}  = require("mongoose").Types;
const jwt = require("jsonwebtoken");

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    id: {
      type: GraphQLID,
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
      },
    },
    quantity: {
      type: GraphQLInt,
    },
    price: {
      type: GraphQLString,
    },
    discount: {
      type: GraphQLInt,
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    avatar: {
      type: GraphQLString,
    },
    authToken: {
      type: GraphQLString,
      resolve(parent, args) {
        let token = jwt.sign({ id: parent.id }, "sih2020");
        return token;
      },
    },
    items: {
      type: new GraphQLList(ItemType),
      async resolve(parent, args) {
        let list = await User.findById({ _id: parent.id }).populate("items");
        return list.items;
      },
    },
  }),
});
const CropToData = new GraphQLObjectType({
  name: "CropData",
  fields: () => ({
    y: {
      type: GraphQLFloat,
    },
    label: {
      type: GraphQLString,
    },
  }),
});
const FarmerType = new GraphQLObjectType({
  name: "Farmer",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    address: {
      type: GraphQLString,
    },
    google_access_token: {
      type: GraphQLString,
    },
    local_access_token: {
      type: GraphQLString,
    },
  }),
});

const ComplaintType = new GraphQLObjectType({
  name: "Complaint",
  fields: () => ({
    farmer: {
      type: FarmerType,
      async resolve(parent, args) {
        farmer = await Farmer.findById(parent.farmer);
        return farmer;
      },
    },
    count: {
      type: graphql.GraphQLString,
    },
    ratings: {
      type: GraphQLInt,
    },
    avg_rating: {
      type: GraphQLFloat,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        let item = await Item.findById({ _id: args.id });
        return item;
      },
    },
    user: {
      type: UserType,
      args: { phone: { type: GraphQLString } },
      async resolve(parent, args) {
        let user = await User.findOne({ phone: args.phone });
        return user;
      },
    },
    farmers: {
      type: new GraphQLList(FarmerType),
      async resolve(parent, args) {
        let farmers = await Farmer.find({});
        return farmers;
      },
    },

    complaint: {
      type: new GraphQLObjectType({
        name: "complaint",
        fields: () => ({
          farmer: {
            type: FarmerType,
            async resolve(parent, args) {
              farmer = await Farmer.findById(parent.farmer);
              return farmer;
            },
          },
          production: {
            type: new GraphQLList(CropToData),
            async resolve(parent, args) {
              let agg = [
                { $match: { farmer: ObjectId(`${parent.farmer}`) } },
                {
                  $group: {
                    _id: {
                      crop: "$title",
                    },
                    amount: { $sum: "$quantity" },
                  },
                },
              ];
              let logs = await Item.aggregate(agg);
              const reducer = (accumulator, currentValue) => accumulator + currentValue.amount;
              let total = logs.reduce(reducer,0);
              let modified = logs.map((log, index) => ({
                y: (parseInt(log.amount, 10)/total)*100,
                label: log._id.crop,
              }));
              return modified;
              
            },
          },
         
          complaints: {
            type: new GraphQLList(GraphQLString),
            async resolve(parent,args){
              let unmodified;

              if(parent.crop === "all" && parent.category === "all"){
                unmodified = await Complaint.find({
                  farmer:parent.farmer
                });
              }else if(parent.crop === "all"){
                unmodified = await Complaint.find({
                  farmer:parent.farmer,
                  category:parent.category
                });
              }else if(parent.category === "all"){
                unmodified = await Complaint.find({
                  farmer:parent.farmer,
                  crop:parent.crop
                });
              }else{
                unmodified = await Complaint.find({
                  farmer:parent.farmer,
                  crop:parent.crop,
                  category:parent.category
                });
              }
              let modified = unmodified.map((log,index)=>(log.content));
                return modified;
            }
          },
        }),
      }),
      args: {
        id: { type: GraphQLID },
        crop: { type: GraphQLString },
        category: { type: GraphQLString },
      },
      async resolve(parent, args) {
       return {
         farmer:args.id,
         crop:args.crop,
         category:args.category
       }
      }
    },

    getSalesByState: {
      type: new GraphQLObjectType({
          name:"getSalesByState",
          fields:()=>({
            crops: {
                type: new GraphQLList(GraphQLString),
              },
              sales: {
                type: new GraphQLList(GraphQLFloat),
              }
          })
      
      }),
      args: { state: { type: GraphQLString } },
      async resolve(parent, args) {
 /*
*TODO:
*find the sales in a given state  based on the state argument
*
*/
        let sales = { 
          crops: ["Rice", "wheat", "Maize"],
          sales: [35.0, 28.4, 12.9],
        };
        console.log(sales);
        return sales;
      },
    },



    
    complaints: {
      type: new GraphQLList(ComplaintType),
      args: {
        crop: { type: GraphQLString },
        category: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log("complaints args",args)
        if (args.crop === "all" && args.category === "all") {
          let agg = [
            {
              $group: {
                _id: {
                  farmer: "$farmer",
                },

                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ];
          let logs = await Complaint.aggregate(agg);
          let modified = logs.map(function (log, index) {
            let obj = {
              farmer: log._id.farmer,
              count: log.total,
              ratings: 10,
              avg_rating: 3.6,
            };
            return obj;
          });
          return modified;
        } else if (args.crop === "all") {
          let agg = [
            {
              $group: {
                _id: {
                  farmer: "$farmer",
                  category: "$category",
                },

                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ];
          let logs = await Complaint.aggregate(agg);
          let filtered = logs.filter(function (log) {
            return log._id.category == args.category;
          });
          let modified = filtered.map(function (log, index) {
            let obj = {
              farmer: log._id.farmer,
              count: log.total,
              ratings: 10,
              avg_rating: 3.6,
            };
            return obj;
          });

          return modified;
        } else if (args.category === "all") {
          let agg = [
            {
              $group: {
                _id: {
                  farmer: "$farmer",
                  crops: "$crops",
                },

                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ];
          let logs = await Complaint.aggregate(agg);
          let filtered = logs.filter(function (log) {
            return log._id.crop == args.crop;
          });
          let modified = filtered.map(function (log, index) {
            let obj = {
              farmer: log._id.farmer,
              count: log.total,
              ratings: 10,
              avg_rating: 3.6,
            };
            return obj;
          });

          return modified;
        } else {
          let agg = [
            {
              $group: {
                _id: {
                  farmer: "$farmer",
                  category: "$category",
                  crop: "$crop",
                },

                total: { $sum: 1 },
              },
            },
            { $sort: { total: -1 } },
          ];
          let logs = await Complaint.aggregate(agg);
          let filtered = logs.filter(function (log) {
            return (
              log._id.category === args.category && log._id.crop === args.crop
            );
          });
          let modified = filtered.map(function (log, index) {
            let obj = {
              farmer: log._id.farmer,
              count: log.total,
              ratings: 10,
              avg_rating: 3.6,
            };
            return obj;
          });

          return modified;
        }
      },
    },

    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args, context) {
        console.log(context.headers.authorization);
        let users = await User.find({});
        return users;
      },
    },
    items: {
      type: new GraphQLList(ItemType),
      async resolve(parent, args) {
        let items = await Item.find({});
        return items;
      },
    },
  },
});

const Mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        emailOrPhone: { type: GraphQLString },
        password: { type: GraphQLString },
        address: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log("hey");
        let user = await User.create({
          first_name: args.name,
          emailOrPhone: args.emailOrPhone,
          password: args.password,
          last_name: args.last_name,
          role: args.role,
          address: args.address,
        });
        return user;
      },
    },
    addItem: {
      type: ItemType,
      args: {
        title: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        userId: { type: GraphQLID },
      },
      async resolve(parent, args) {
        let item = await Item.create({
          title: args.title,
          quantity: args.quantity,
          user: args.userId,
        });
        let user = await User.findById({ _id: args.userId });
        await user.items.push(item._id);
        user.save();
        return item;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutations,
});
