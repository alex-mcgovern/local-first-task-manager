import { z } from "zod";
import type { Prisma } from "./prismaClient";
import { type TableSchema, DbSchema, ElectricClient, type HKT } from "electric-sql/client/model";
import migrations from "./migrations";
import pgMigrations from "./pg-migrations";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const TasksScalarFieldEnumSchema = z.enum([
	"id",
	"title",
	"description",
	"status",
	"created_at",
	"updated_at",
	"due_date",
]);

export const TransactionIsolationLevelSchema = z.enum([
	"ReadUncommitted",
	"ReadCommitted",
	"RepeatableRead",
	"Serializable",
]);

export const task_statusSchema = z.enum(["to_do", "in_progress", "completed"]);

export type task_statusType = `${z.infer<typeof task_statusSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// TASKS SCHEMA
/////////////////////////////////////////

export const TasksSchema = z.object({
	status: task_statusSchema,
	id: z.string().uuid(),
	title: z.string(),
	description: z.string().nullable(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	due_date: z.coerce.date().nullable(),
});

export type Tasks = z.infer<typeof TasksSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// TASKS
//------------------------------------------------------

export const TasksSelectSchema: z.ZodType<Prisma.TasksSelect> = z
	.object({
		id: z.boolean().optional(),
		title: z.boolean().optional(),
		description: z.boolean().optional(),
		status: z.boolean().optional(),
		created_at: z.boolean().optional(),
		updated_at: z.boolean().optional(),
		due_date: z.boolean().optional(),
	})
	.strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const TasksWhereInputSchema: z.ZodType<Prisma.TasksWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => TasksWhereInputSchema),
				z.lazy(() => TasksWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => TasksWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => TasksWhereInputSchema),
				z.lazy(() => TasksWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => UuidFilterSchema), z.string()]).optional(),
		title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		description: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		status: z
			.union([z.lazy(() => Enumtask_statusFilterSchema), z.lazy(() => task_statusSchema)])
			.optional(),
		created_at: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updated_at: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		due_date: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
	})
	.strict();

export const TasksOrderByWithRelationInputSchema: z.ZodType<Prisma.TasksOrderByWithRelationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			created_at: z.lazy(() => SortOrderSchema).optional(),
			updated_at: z.lazy(() => SortOrderSchema).optional(),
			due_date: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const TasksWhereUniqueInputSchema: z.ZodType<Prisma.TasksWhereUniqueInput> = z
	.object({
		id: z.string().uuid().optional(),
	})
	.strict();

export const TasksOrderByWithAggregationInputSchema: z.ZodType<Prisma.TasksOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			created_at: z.lazy(() => SortOrderSchema).optional(),
			updated_at: z.lazy(() => SortOrderSchema).optional(),
			due_date: z.lazy(() => SortOrderSchema).optional(),
			_count: z.lazy(() => TasksCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => TasksMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => TasksMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const TasksScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TasksScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => TasksScalarWhereWithAggregatesInputSchema),
					z.lazy(() => TasksScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => TasksScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => TasksScalarWhereWithAggregatesInputSchema),
					z.lazy(() => TasksScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => UuidWithAggregatesFilterSchema), z.string()]).optional(),
			title: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			description: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			status: z
				.union([
					z.lazy(() => Enumtask_statusWithAggregatesFilterSchema),
					z.lazy(() => task_statusSchema),
				])
				.optional(),
			created_at: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			updated_at: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			due_date: z
				.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
		})
		.strict();

export const TasksCreateInputSchema: z.ZodType<Prisma.TasksCreateInput> = z
	.object({
		id: z.string().uuid(),
		title: z.string(),
		description: z.string().optional().nullable(),
		status: z.lazy(() => task_statusSchema),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
		due_date: z.coerce.date().optional().nullable(),
	})
	.strict();

export const TasksUncheckedCreateInputSchema: z.ZodType<Prisma.TasksUncheckedCreateInput> = z
	.object({
		id: z.string().uuid(),
		title: z.string(),
		description: z.string().optional().nullable(),
		status: z.lazy(() => task_statusSchema),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
		due_date: z.coerce.date().optional().nullable(),
	})
	.strict();

export const TasksUpdateInputSchema: z.ZodType<Prisma.TasksUpdateInput> = z
	.object({
		id: z
			.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		title: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		description: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		status: z
			.union([
				z.lazy(() => task_statusSchema),
				z.lazy(() => Enumtask_statusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		created_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updated_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		due_date: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const TasksUncheckedUpdateInputSchema: z.ZodType<Prisma.TasksUncheckedUpdateInput> = z
	.object({
		id: z
			.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		title: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		description: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		status: z
			.union([
				z.lazy(() => task_statusSchema),
				z.lazy(() => Enumtask_statusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		created_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updated_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		due_date: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const TasksCreateManyInputSchema: z.ZodType<Prisma.TasksCreateManyInput> = z
	.object({
		id: z.string().uuid(),
		title: z.string(),
		description: z.string().optional().nullable(),
		status: z.lazy(() => task_statusSchema),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
		due_date: z.coerce.date().optional().nullable(),
	})
	.strict();

export const TasksUpdateManyMutationInputSchema: z.ZodType<Prisma.TasksUpdateManyMutationInput> = z
	.object({
		id: z
			.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		title: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		description: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		status: z
			.union([
				z.lazy(() => task_statusSchema),
				z.lazy(() => Enumtask_statusFieldUpdateOperationsInputSchema),
			])
			.optional(),
		created_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updated_at: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		due_date: z
			.union([
				z.coerce.date(),
				z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const TasksUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TasksUncheckedUpdateManyInput> =
	z
		.object({
			id: z
				.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			title: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			description: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			status: z
				.union([
					z.lazy(() => task_statusSchema),
					z.lazy(() => Enumtask_statusFieldUpdateOperationsInputSchema),
				])
				.optional(),
			created_at: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updated_at: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			due_date: z
				.union([
					z.coerce.date(),
					z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
		})
		.strict();

export const UuidFilterSchema: z.ZodType<Prisma.UuidFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedUuidFilterSchema)]).optional(),
	})
	.strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
	})
	.strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z
	.object({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const Enumtask_statusFilterSchema: z.ZodType<Prisma.Enumtask_statusFilter> = z
	.object({
		equals: z.lazy(() => task_statusSchema).optional(),
		in: z
			.lazy(() => task_statusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => task_statusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => task_statusSchema),
				z.lazy(() => NestedEnumtask_statusFilterSchema),
			])
			.optional(),
	})
	.strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
	})
	.strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z
	.object({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const TasksCountOrderByAggregateInputSchema: z.ZodType<Prisma.TasksCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			created_at: z.lazy(() => SortOrderSchema).optional(),
			updated_at: z.lazy(() => SortOrderSchema).optional(),
			due_date: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const TasksMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TasksMaxOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			created_at: z.lazy(() => SortOrderSchema).optional(),
			updated_at: z.lazy(() => SortOrderSchema).optional(),
			due_date: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const TasksMinOrderByAggregateInputSchema: z.ZodType<Prisma.TasksMinOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			title: z.lazy(() => SortOrderSchema).optional(),
			description: z.lazy(() => SortOrderSchema).optional(),
			status: z.lazy(() => SortOrderSchema).optional(),
			created_at: z.lazy(() => SortOrderSchema).optional(),
			updated_at: z.lazy(() => SortOrderSchema).optional(),
			due_date: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const UuidWithAggregatesFilterSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	})
	.strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	})
	.strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional().nullable(),
			in: z.string().array().optional().nullable(),
			notIn: z.string().array().optional().nullable(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			mode: z.lazy(() => QueryModeSchema).optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		})
		.strict();

export const Enumtask_statusWithAggregatesFilterSchema: z.ZodType<Prisma.Enumtask_statusWithAggregatesFilter> =
	z
		.object({
			equals: z.lazy(() => task_statusSchema).optional(),
			in: z
				.lazy(() => task_statusSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => task_statusSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => task_statusSchema),
					z.lazy(() => NestedEnumtask_statusWithAggregatesFilterSchema),
				])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedEnumtask_statusFilterSchema).optional(),
			_max: z.lazy(() => NestedEnumtask_statusFilterSchema).optional(),
		})
		.strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	})
	.strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional().nullable(),
			in: z.coerce.date().array().optional().nullable(),
			notIn: z.coerce.date().array().optional().nullable(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([
					z.coerce.date(),
					z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
				])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		})
		.strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
	z
		.object({
			set: z.string().optional(),
		})
		.strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
	z
		.object({
			set: z.string().optional().nullable(),
		})
		.strict();

export const Enumtask_statusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.Enumtask_statusFieldUpdateOperationsInput> =
	z
		.object({
			set: z.lazy(() => task_statusSchema).optional(),
		})
		.strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
	z
		.object({
			set: z.coerce.date().optional(),
		})
		.strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
	z
		.object({
			set: z.coerce.date().optional().nullable(),
		})
		.strict();

export const NestedUuidFilterSchema: z.ZodType<Prisma.NestedUuidFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		not: z.union([z.string(), z.lazy(() => NestedUuidFilterSchema)]).optional(),
	})
	.strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
	})
	.strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z
	.object({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedEnumtask_statusFilterSchema: z.ZodType<Prisma.NestedEnumtask_statusFilter> = z
	.object({
		equals: z.lazy(() => task_statusSchema).optional(),
		in: z
			.lazy(() => task_statusSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => task_statusSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => task_statusSchema),
				z.lazy(() => NestedEnumtask_statusFilterSchema),
			])
			.optional(),
	})
	.strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
	})
	.strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z
	.object({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedUuidWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional(),
			in: z.string().array().optional(),
			notIn: z.string().array().optional(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedUuidWithAggregatesFilterSchema)])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedStringFilterSchema).optional(),
			_max: z.lazy(() => NestedStringFilterSchema).optional(),
		})
		.strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
	.object({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
	})
	.strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional(),
			in: z.string().array().optional(),
			notIn: z.string().array().optional(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedStringFilterSchema).optional(),
			_max: z.lazy(() => NestedStringFilterSchema).optional(),
		})
		.strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional().nullable(),
			in: z.string().array().optional().nullable(),
			notIn: z.string().array().optional().nullable(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		})
		.strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z
	.object({
		equals: z.number().optional().nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedEnumtask_statusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumtask_statusWithAggregatesFilter> =
	z
		.object({
			equals: z.lazy(() => task_statusSchema).optional(),
			in: z
				.lazy(() => task_statusSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => task_statusSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => task_statusSchema),
					z.lazy(() => NestedEnumtask_statusWithAggregatesFilterSchema),
				])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedEnumtask_statusFilterSchema).optional(),
			_max: z.lazy(() => NestedEnumtask_statusFilterSchema).optional(),
		})
		.strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional(),
			in: z.coerce.date().array().optional(),
			notIn: z.coerce.date().array().optional(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		})
		.strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional().nullable(),
			in: z.coerce.date().array().optional().nullable(),
			notIn: z.coerce.date().array().optional().nullable(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([
					z.coerce.date(),
					z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema),
				])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		})
		.strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const TasksFindFirstArgsSchema: z.ZodType<Prisma.TasksFindFirstArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereInputSchema.optional(),
		orderBy: z
			.union([
				TasksOrderByWithRelationInputSchema.array(),
				TasksOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: TasksWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: TasksScalarFieldEnumSchema.array().optional(),
	})
	.strict();

export const TasksFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TasksFindFirstOrThrowArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereInputSchema.optional(),
		orderBy: z
			.union([
				TasksOrderByWithRelationInputSchema.array(),
				TasksOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: TasksWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: TasksScalarFieldEnumSchema.array().optional(),
	})
	.strict();

export const TasksFindManyArgsSchema: z.ZodType<Prisma.TasksFindManyArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereInputSchema.optional(),
		orderBy: z
			.union([
				TasksOrderByWithRelationInputSchema.array(),
				TasksOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: TasksWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: TasksScalarFieldEnumSchema.array().optional(),
	})
	.strict();

export const TasksAggregateArgsSchema: z.ZodType<Prisma.TasksAggregateArgs> = z
	.object({
		where: TasksWhereInputSchema.optional(),
		orderBy: z
			.union([
				TasksOrderByWithRelationInputSchema.array(),
				TasksOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: TasksWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const TasksGroupByArgsSchema: z.ZodType<Prisma.TasksGroupByArgs> = z
	.object({
		where: TasksWhereInputSchema.optional(),
		orderBy: z
			.union([
				TasksOrderByWithAggregationInputSchema.array(),
				TasksOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: TasksScalarFieldEnumSchema.array(),
		having: TasksScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const TasksFindUniqueArgsSchema: z.ZodType<Prisma.TasksFindUniqueArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereUniqueInputSchema,
	})
	.strict();

export const TasksFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TasksFindUniqueOrThrowArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereUniqueInputSchema,
	})
	.strict();

export const TasksCreateArgsSchema: z.ZodType<Prisma.TasksCreateArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		data: z.union([TasksCreateInputSchema, TasksUncheckedCreateInputSchema]),
	})
	.strict();

export const TasksUpsertArgsSchema: z.ZodType<Prisma.TasksUpsertArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereUniqueInputSchema,
		create: z.union([TasksCreateInputSchema, TasksUncheckedCreateInputSchema]),
		update: z.union([TasksUpdateInputSchema, TasksUncheckedUpdateInputSchema]),
	})
	.strict();

export const TasksCreateManyArgsSchema: z.ZodType<Prisma.TasksCreateManyArgs> = z
	.object({
		data: TasksCreateManyInputSchema.array(),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const TasksDeleteArgsSchema: z.ZodType<Prisma.TasksDeleteArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		where: TasksWhereUniqueInputSchema,
	})
	.strict();

export const TasksUpdateArgsSchema: z.ZodType<Prisma.TasksUpdateArgs> = z
	.object({
		select: TasksSelectSchema.optional(),
		data: z.union([TasksUpdateInputSchema, TasksUncheckedUpdateInputSchema]),
		where: TasksWhereUniqueInputSchema,
	})
	.strict();

export const TasksUpdateManyArgsSchema: z.ZodType<Prisma.TasksUpdateManyArgs> = z
	.object({
		data: z.union([TasksUpdateManyMutationInputSchema, TasksUncheckedUpdateManyInputSchema]),
		where: TasksWhereInputSchema.optional(),
	})
	.strict();

export const TasksDeleteManyArgsSchema: z.ZodType<Prisma.TasksDeleteManyArgs> = z
	.object({
		where: TasksWhereInputSchema.optional(),
	})
	.strict();

interface TasksGetPayload extends HKT {
	readonly _A?: boolean | null | undefined | Prisma.TasksArgs;
	readonly type: Omit<
		Prisma.TasksGetPayload<this["_A"]>,
		"Please either choose `select` or `include`"
	>;
}

export const tableSchemas = {
	tasks: {
		fields: new Map([
			["id", "UUID"],
			["title", "TEXT"],
			["description", "TEXT"],
			["status", "TEXT"],
			["created_at", "TIMESTAMPTZ"],
			["updated_at", "TIMESTAMPTZ"],
			["due_date", "TIMESTAMPTZ"],
		]),
		relations: [],
		modelSchema: (TasksCreateInputSchema as any)
			.partial()
			.or((TasksUncheckedCreateInputSchema as any).partial()),
		createSchema: TasksCreateArgsSchema,
		createManySchema: TasksCreateManyArgsSchema,
		findUniqueSchema: TasksFindUniqueArgsSchema,
		findSchema: TasksFindFirstArgsSchema,
		updateSchema: TasksUpdateArgsSchema,
		updateManySchema: TasksUpdateManyArgsSchema,
		upsertSchema: TasksUpsertArgsSchema,
		deleteSchema: TasksDeleteArgsSchema,
		deleteManySchema: TasksDeleteManyArgsSchema,
	} as TableSchema<
		z.infer<typeof TasksUncheckedCreateInputSchema>,
		Prisma.TasksCreateArgs["data"],
		Prisma.TasksUpdateArgs["data"],
		Prisma.TasksFindFirstArgs["select"],
		Prisma.TasksFindFirstArgs["where"],
		Prisma.TasksFindUniqueArgs["where"],
		never,
		Prisma.TasksFindFirstArgs["orderBy"],
		Prisma.TasksScalarFieldEnum,
		TasksGetPayload
	>,
};

export const schema = new DbSchema(tableSchemas, migrations, pgMigrations);
export type Electric = ElectricClient<typeof schema>;
