/** ActionResponse */
export interface ActionResponse {
  /** Status */
  status: string;
  /** Message */
  message: string;
}

/** AdminCraftsmanProfile */
export interface AdminCraftsmanProfile {
  /** User Id */
  user_id: string;
  /** Name */
  name?: string | null;
  /** Business Name */
  business_name?: string | null;
  /** Email */
  email?: string | null;
  /** Phone Number */
  phone_number?: string | null;
  /** Org Number */
  org_number?: string | null;
  /** Verification Status */
  verification_status?: string | null;
  /** Verification Method */
  verification_method?: string | null;
  /** Is Verified */
  is_verified?: boolean | null;
  /** Lead Balance */
  lead_balance?: number | null;
  /** Created At */
  created_at?: string | null;
  /** Id Document Url */
  id_document_url?: string | null;
}

/** AffiliateProduct */
export interface AffiliateProduct {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Image Url */
  image_url: string;
  /** Product Url */
  product_url: string;
  /** Partner Name */
  partner_name: string;
}

/** AssignmentDetails */
export interface AssignmentDetails {
  /** Headline */
  headline: string;
  /** Detailed Description */
  detailed_description: string;
  /** Location */
  location: string;
  /** Customer Name */
  customer_name: string;
  /** Customer Email */
  customer_email: string;
  /** Customer Phone */
  customer_phone: string;
  /** Required Services */
  required_services: string[];
  /** Id */
  id: number;
  /** Status */
  status: string;
  /** Created At */
  created_at: string;
  /** Updated At */
  updated_at: string;
}

/** AssignmentResponse */
export interface AssignmentResponse {
  /** Id */
  id: number;
  /** Headline */
  headline?: string | null;
  /** Detailed Description */
  detailed_description?: string | null;
  /** Location */
  location?: string | null;
  /** Status */
  status: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Updated At */
  updated_at?: string | null;
  /** Selected Craftsman Id */
  selected_craftsman_id?: string | null;
  /** Customer Id */
  customer_id?: string | null;
  /** Customer Name */
  customer_name?: string | null;
  /** Customer Email */
  customer_email?: string | null;
  /** Customer Phone */
  customer_phone?: string | null;
  /**
   * Required Services
   * @default []
   */
  required_services?: string[];
  /**
   * Is Reviewed
   * @default false
   */
  is_reviewed?: boolean;
  /** Relationship */
  relationship?: string | null;
  /**
   * Interested Craftsmen
   * @default []
   */
  interested_craftsmen?: Interest[];
}

/** Body_upload_id_document */
export interface BodyUploadIdDocument {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** Body_upload_profile_photo */
export interface BodyUploadProfilePhoto {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** CraftsmanProfile */
export interface CraftsmanProfile {
  /**
   * Business Name
   * @default ""
   */
  business_name?: string | null;
  /**
   * Org Number
   * @default ""
   */
  org_number?: string | null;
  /**
   * Phone Number
   * @default ""
   */
  phone_number?: string | null;
  /**
   * Experience Level
   * @default ""
   */
  experience_level?: string | null;
  /**
   * Pricing Info
   * @default ""
   */
  pricing_info?: string | null;
  /**
   * Services
   * @default []
   */
  services?: string[] | null;
  /**
   * Service Areas
   * @default []
   */
  service_areas?: string[] | null;
  /**
   * Profile Photo Url
   * @default ""
   */
  profile_photo_url?: string | null;
  /**
   * Id Document Url
   * @default ""
   */
  id_document_url?: string | null;
  /**
   * Email
   * @default ""
   */
  email?: string | null;
  /**
   * Is Verified
   * @default false
   */
  is_verified?: boolean | null;
  /**
   * Verification Status
   * @default "pending"
   */
  verification_status?: string;
  /**
   * Verification Method
   * @default "manual"
   */
  verification_method?: string;
  /** Promo Start */
  promo_start?: string | null;
  /**
   * Region
   * @default "Oslo"
   */
  region?: string;
  /** Lead Balance */
  lead_balance: number;
  /**
   * Rating
   * @default 0
   */
  rating?: number;
  /**
   * Review Count
   * @default 0
   */
  review_count?: number;
}

/** CraftsmanPublicProfile */
export interface CraftsmanPublicProfile {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Company Name */
  company_name?: string | null;
  /** Phone Number */
  phone_number?: string | null;
  /** Bio */
  bio?: string | null;
  /** Profile Picture Url */
  profile_picture_url?: string | null;
  /** Services Offered */
  services_offered?: string[];
  /** Lead Balance */
  lead_balance: number;
}

/** CreateAssignmentRequest */
export interface CreateAssignmentRequest {
  /** Category */
  category: string;
  /** Description */
  description: string;
}

/** CreateReviewRequest */
export interface CreateReviewRequest {
  /** Assignment Id */
  assignment_id: number;
  /**
   * Rating
   * @min 1
   * @max 5
   */
  rating: number;
  /** Comment */
  comment?: string | null;
}

/** EmailTarget */
export interface EmailTarget {
  /** User Ids */
  user_ids?: string[] | null;
}

/** FinalizeVerificationRequest */
export interface FinalizeVerificationRequest {
  /** Code */
  code: string;
  /** State */
  state: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** InitiateVerificationRequest */
export interface InitiateVerificationRequest {
  /** Ssn */
  ssn?: string | null;
  /**
   * Method
   * @default "bankid"
   */
  method?: string;
}

/** InitiateVerificationResponse */
export interface InitiateVerificationResponse {
  /** Redirecturi */
  redirectUri: string;
  /** State */
  state: string;
}

/** Interest */
export interface Interest {
  /**
   * Craftsman Id
   * @format uuid
   */
  craftsman_id: string;
  /** Business Name */
  business_name?: string | null;
  /** Profile Photo Url */
  profile_photo_url?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
}

/** ProductItem */
export interface ProductItem {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Description */
  description: string;
  /** Imageurl */
  imageUrl: string;
  /** Link */
  link: string;
}

/** PublicContactDetails */
export interface PublicContactDetails {
  /** Phone Number */
  phone_number: string;
}

/** Review */
export interface Review {
  /**
   * Id
   * @format uuid
   */
  id: string;
  /** Assignment Id */
  assignment_id: number;
  /**
   * Customer Id
   * @format uuid
   */
  customer_id: string;
  /**
   * Craftsman Id
   * @format uuid
   */
  craftsman_id: string;
  /**
   * Rating
   * @min 1
   * @max 5
   */
  rating: number;
  /** Comment */
  comment?: string | null;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Customer Name */
  customer_name?: string | null;
}

/** SelectCraftsmanRequest */
export interface SelectCraftsmanRequest {
  /** Assignment Id */
  assignment_id: number;
  /**
   * Craftsman User Id
   * @format uuid
   */
  craftsman_user_id: string;
}

/** StripePayment */
export interface StripePayment {
  /** Id */
  id: number;
  /** User Id */
  user_id: string;
  /** Product Id */
  product_id?: number | null;
  /** Stripe Charge Id */
  stripe_charge_id: string;
  /** Amount */
  amount: number;
  /** Created At */
  created_at: string;
}

/** StripeProduct */
export interface StripeProduct {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Price */
  price: number;
  /** Lead Count */
  lead_count: number;
  /** Stripe Product Id */
  stripe_product_id?: string | null;
}

/** UpdateCraftsmanProfile */
export interface UpdateCraftsmanProfile {
  /** Business Name */
  business_name?: string | null;
  /** Org Number */
  org_number?: string | null;
  /** Phone Number */
  phone_number?: string | null;
  /** Experience Level */
  experience_level?: string | null;
  /** Pricing Info */
  pricing_info?: string | null;
  /** Services */
  services?: string[] | null;
  /** Service Areas */
  service_areas?: string[] | null;
  /** Id Document Url */
  id_document_url?: string | null;
  /** Region */
  region?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type InitiateBankidVerificationData = InitiateVerificationResponse;

export type InitiateBankidVerificationError = HTTPValidationError;

export type FinalizeBankidVerificationData = any;

export type FinalizeBankidVerificationError = HTTPValidationError;

export type SendNewJobAlertData = any;

export type SendNewJobAlertError = HTTPValidationError;

/** Response List Open Assignments */
export type ListOpenAssignmentsData = AssignmentResponse[];

export type CreateAssignmentData = AssignmentResponse;

export type CreateAssignmentError = HTTPValidationError;

/** Response Get My Assignments */
export type GetMyAssignmentsData = AssignmentResponse[];

export type SelectCraftsmanData = AssignmentResponse;

export type SelectCraftsmanError = HTTPValidationError;

/** Response Get Craftsman Assignments */
export type GetCraftsmanAssignmentsData = AssignmentResponse[];

export interface GetAssignmentByIdParams {
  /** Assignment Id */
  assignmentId: number;
}

export type GetAssignmentByIdData = AssignmentResponse;

export type GetAssignmentByIdError = HTTPValidationError;

export interface RegisterInterestParams {
  /** Assignment Id */
  assignmentId: number;
}

export type RegisterInterestData = AssignmentResponse;

export type RegisterInterestError = HTTPValidationError;

/** Target */
export type SendMonthlyEmailsPayload = EmailTarget | null;

export type SendMonthlyEmailsData = any;

export type SendMonthlyEmailsError = HTTPValidationError;

/** Target */
export type SendLaunchEmailsPayload = EmailTarget | null;

export type SendLaunchEmailsData = any;

export type SendLaunchEmailsError = HTTPValidationError;

export type SubmitReviewData = Review;

export type SubmitReviewError = HTTPValidationError;

/** Response Get My Reviews */
export type GetMyReviewsData = Review[];

export interface GetReviewsForCraftsmanParams {
  /**
   * Craftsman Id
   * @format uuid
   */
  craftsmanId: string;
}

/** Response Get Reviews For Craftsman */
export type GetReviewsForCraftsmanData = Review[];

export type GetReviewsForCraftsmanError = HTTPValidationError;

/** Response List Affiliate Products2 */
export type ListAffiliateProducts2Data = AffiliateProduct[];

/** Response List Products */
export type ListProductsData = StripeProduct[];

/** Response Get Payment History */
export type GetPaymentHistoryData = StripePayment[];

export interface CreateCheckoutSessionPayload {
  product_id?: number | null;
  assignment_id?: number | null;
  product_type?: string | null;
}

export type CreateCheckoutSessionData = any;

export type StripeWebhookData = any;

/** Response List Affiliate Products */
export type ListAffiliateProductsData = ProductItem[];

export type GetPublicContactDetailsData = PublicContactDetails;

export type GetCurrentCraftsmanProfileData = CraftsmanProfile;

export type UpdateCraftsmanProfileData = CraftsmanProfile;

export type UpdateCraftsmanProfileError = HTTPValidationError;

export type UploadProfilePhotoData = any;

export type UploadProfilePhotoError = HTTPValidationError;

export type UploadIdDocumentData = any;

export type UploadIdDocumentError = HTTPValidationError;

export interface GetCraftsmanAssetParams {
  /** Filename */
  filename: string;
}

export type GetCraftsmanAssetData = any;

export type GetCraftsmanAssetError = HTTPValidationError;

export interface SearchCraftsmenParams {
  /** Searchterm */
  searchTerm?: string | null;
  /** Services */
  services?: string[] | null;
  /** Areas */
  areas?: string[] | null;
}

/** Response Search Craftsmen */
export type SearchCraftsmenData = CraftsmanPublicProfile[];

export type SearchCraftsmenError = HTTPValidationError;

export interface GetCraftsmanProfileByIdParams {
  /** Craftsman Id */
  craftsmanId: string;
}

export type GetCraftsmanProfileByIdData = CraftsmanPublicProfile;

export type GetCraftsmanProfileByIdError = HTTPValidationError;

/** Response List All Craftsmen */
export type ListAllCraftsmenData = AdminCraftsmanProfile[];

export interface ApproveCraftsmanParams {
  /** User Id */
  userId: string;
}

export type ApproveCraftsmanData = ActionResponse;

export type ApproveCraftsmanError = HTTPValidationError;

export interface DeleteCraftsmanParams {
  /** User Id */
  userId: string;
}

export type DeleteCraftsmanData = ActionResponse;

export type DeleteCraftsmanError = HTTPValidationError;
