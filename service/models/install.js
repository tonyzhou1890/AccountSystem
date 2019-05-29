/**
 * Created by wyf on 2017/1/13.
 */
let mongoose =  require('mongoose');
let Schema = mongoose.Schema;

let installSchema = new Schema({
    installTime: Date,
	  installNumber: Number,
    status: String,
    customerId: String,
    productId: String,
	  installId: String
});

/**
 *here can add same methods or statics
 */
installSchema.statics.findByInstallId=function(installId, cb){
    return this.find({_id:installId}, cb);
};

module.exports = mongoose.model('Install', installSchema);