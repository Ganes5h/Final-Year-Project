// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      //   select: false,
    },
    role: {
      type: String,
      enum: ["admin", "club_coordinator", "faculty", "student"],
      required: [true, "Role is required"],
    },
    department: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "default.jpg",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    firstLogin: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    totalActivityPoints: {
      type: Number,
      default: 0,
    },
    fcmToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// models/Club.js
const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// models/Event.js
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    activityPoints: {
      type: Number,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    whatsappLink: String,
    // registrationForm: {
    // 	fields: [
    // 		{
    // 			name: { type: String, required: true }, // Name of the field
    // 			type: {
    // 				type: String,
    // 				enum: ["text", "email", "number", "select", "checkbox"],
    // 				required: true,
    // 			}, // Field type
    // 			required: { type: Boolean, default: false }, // Is field required?
    // 			options: [{ type: String }], // Options for select or checkbox fields
    // 		},
    // 	],
    // },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    participants: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registrationDate: {
          type: Date,
          default: Date.now,
        },
        attendance: {
          type: Boolean,
          default: false,
        },
        certificateIssued: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// models/Certificate.js
const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    certificateHash: {
      type: String,
      required: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
    revokedReason: String,
    revokedDate: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    activityPoints: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// models/DigiLocker.js
const digiLockerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documents: [
      {
        title: {
          type: String,
          required: true,
        },
        description: String,
        fileType: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        source: {
          type: String,
          enum: ["platform", "external"],
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
      },
    ],
    totalSize: {
      type: Number,
      default: 0,
    },
    maxSize: {
      type: Number,
      default: 100 * 1024 * 1024, // 100MB limit
    },
    documentCount: {
      type: Number,
      default: 0,
    },
    maxDocuments: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

// models/Notification.js
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["event", "certificate", "registration", "points", "system"],
      required: true,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ["Event", "Certificate", "Club"],
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

// models/ActivityPoints.js
const activityPointsSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
    points: {
      type: Number,
      required: true,
    },
    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    awardedDate: {
      type: Date,
      default: Date.now,
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// models/BulkUpload.js
const bulkUploadSchema = new mongoose.Schema(
  {
    uploadType: {
      type: String,
      enum: ["registration", "certificates", "points"],
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
    totalRecords: Number,
    successfulRecords: Number,
    failedRecords: Number,
    errors: [
      {
        row: Number,
        error: String,
      },
    ],
    processedDate: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  Club: mongoose.model("Club", clubSchema),
  Event: mongoose.model("Event", eventSchema),
  Certificate: mongoose.model("Certificate", certificateSchema),
  DigiLocker: mongoose.model("DigiLocker", digiLockerSchema),
  Notification: mongoose.model("Notification", notificationSchema),
  ActivityPoints: mongoose.model("ActivityPoints", activityPointsSchema),
  BulkUpload: mongoose.model("BulkUpload", bulkUploadSchema),
};
