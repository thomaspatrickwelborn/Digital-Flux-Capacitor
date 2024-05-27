import { ObjectId, Mixed, Schema } from 'mongoose'
// Schemata Options
const defaultSchemataOptions = {
	strict: false,
	validateBeforeSave: false,
}
const fsDataBlockSchemaOptions = {
	strict: true,
	validateBeforeSave: false,
}
const FSSettingsSchemaOptions = {
	strict: false,
	validateBeforeSave: false,
}
const BlockStatementSchemaOptions = {
	strict: false,
	validateBeforeSave: false,
}
const BlockElementSchemaOptions = {
	strict: false,
	validateBeforeSave: false,
}
// FS Settings Schema
const FSSettingsSchema = new Schema({
	id: Number,
	name: String,
	path: String,
	permissions: {
		r: Number, w: Number, x: Number,
	},
	operations: {
		add: Boolean,
		update: Boolean,
	},
	encoding: String,
	template: String,
	workspace: String,
	type: String,
}, FSSettingsSchemaOptions)
// FS Data Import Name Schema
const FSDataImportNameSchema = new Schema({
	name: String,
	alias: String,
}, defaultSchemataOptions)
// FS Data Import Schema
const FSDataImportSchema = new Schema({
	name: [FSDataImportNameSchema],
	default: Boolean,
	path: String,
}, defaultSchemataOptions)
// FS Data Export Schema
const FSDataExportNameSchema = new Schema({
	name: String,
	alias: String,
}, defaultSchemataOptions)
const FSDataExportSchema = new Schema({
	name: [FSDataExportNameSchema],
	default: Boolean,
})
// Block Statement Schema
const BlockStatementSchema = new Schema({
	lexter: {
		ser: String,
		ten: String,
		per: String,
		ple: String,
	},
	dexter: {
		ser: String,
		ten: String,
		per: String,
		ple: String,
	}
}, BlockStatementSchemaOptions)
// Block Element Schema
const BlockElementSchema = new Schema({
	tag: {
		per: String,
		name: String,
	},
	attribute: [{
		key: String,
		ten: String,
		per: String,
	}],
	data: [{
		key: String,
		ten: String,
		per: String,
	}],
	text: [{
		key: String,
		ten: String,
		per: String,
	}],
}, BlockElementSchemaOptions)
// FS Data Block Schema
const FSDataBlockSchema = new Schema({}, fsDataBlockSchemaOptions)
FSDataBlockSchema.add({
	element: BlockElementSchema,
	statement: BlockStatementSchema,
	blocks: [FSDataBlockSchema],
})
// FS Data Schema
const FSDataSchema = new Schema({
	import: [FSDataImportSchema],
	blocks: [FSDataBlockSchema],
	export: [FSDataExportSchema],
}, defaultSchemataOptions)
// Fold Schema
const Fold = new Schema({
	fs: FSSettingsSchema,
}, defaultSchemataOptions)
// File Schema
const File = new Schema({
	fs: FSSettingsSchema,
	data: FSDataSchema,
}, defaultSchemataOptions)

export {
	File,
	Fold,
}