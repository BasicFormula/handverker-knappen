import {
  ApproveCraftsmanData,
  ApproveCraftsmanError,
  ApproveCraftsmanParams,
  AssignmentDetails,
  BodyUploadIdDocument,
  BodyUploadProfilePhoto,
  CheckHealthData,
  CreateAssignmentData,
  CreateAssignmentError,
  CreateAssignmentRequest,
  CreateCheckoutSessionData,
  CreateReviewRequest,
  DeleteCraftsmanData,
  DeleteCraftsmanError,
  DeleteCraftsmanParams,
  FinalizeBankidVerificationData,
  FinalizeBankidVerificationError,
  FinalizeVerificationRequest,
  GetAssignmentByIdData,
  GetAssignmentByIdError,
  GetAssignmentByIdParams,
  GetCraftsmanAssetData,
  GetCraftsmanAssetError,
  GetCraftsmanAssetParams,
  GetCraftsmanAssignmentsData,
  GetCraftsmanProfileByIdData,
  GetCraftsmanProfileByIdError,
  GetCraftsmanProfileByIdParams,
  GetCurrentCraftsmanProfileData,
  GetMyAssignmentsData,
  GetMyReviewsData,
  GetPaymentHistoryData,
  GetPublicContactDetailsData,
  GetReviewsForCraftsmanData,
  GetReviewsForCraftsmanError,
  GetReviewsForCraftsmanParams,
  InitiateBankidVerificationData,
  InitiateBankidVerificationError,
  InitiateVerificationRequest,
  ListAffiliateProducts2Data,
  ListAffiliateProductsData,
  ListAllCraftsmenData,
  ListOpenAssignmentsData,
  ListProductsData,
  RegisterInterestData,
  RegisterInterestError,
  RegisterInterestParams,
  SearchCraftsmenData,
  SearchCraftsmenError,
  SearchCraftsmenParams,
  SelectCraftsmanData,
  SelectCraftsmanError,
  SelectCraftsmanRequest,
  SendLaunchEmailsData,
  SendLaunchEmailsError,
  SendLaunchEmailsPayload,
  SendMonthlyEmailsData,
  SendMonthlyEmailsError,
  SendMonthlyEmailsPayload,
  SendNewJobAlertData,
  SendNewJobAlertError,
  StripeWebhookData,
  SubmitReviewData,
  SubmitReviewError,
  UpdateCraftsmanProfile,
  UpdateCraftsmanProfileData,
  UpdateCraftsmanProfileError,
  UploadIdDocumentData,
  UploadIdDocumentError,
  UploadProfilePhotoData,
  UploadProfilePhotoError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Apiclient<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Initiates a BankID verification process for the logged-in craftsman. This endpoint communicates with the Criipto API to create a verification session.
   *
   * @tags dbtn/module:bankid_verification
   * @name initiate_bankid_verification
   * @summary Initiate Bankid Verification
   * @request POST:/routes/initiate-bankid-verification
   */
  initiate_bankid_verification = (data: InitiateVerificationRequest, params: RequestParams = {}) =>
    this.request<InitiateBankidVerificationData, InitiateBankidVerificationError>({
      path: `/routes/initiate-bankid-verification`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Finalizes the verification process. Called by the frontend after receiving the code and state from Criipto.
   *
   * @tags dbtn/module:bankid_verification
   * @name finalize_bankid_verification
   * @summary Finalize Bankid Verification
   * @request POST:/routes/finalize-bankid-verification
   */
  finalize_bankid_verification = (data: FinalizeVerificationRequest, params: RequestParams = {}) =>
    this.request<FinalizeBankidVerificationData, FinalizeBankidVerificationError>({
      path: `/routes/finalize-bankid-verification`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description This endpoint is triggered when a new service request is created. It finds matching craftsmen and sends them an email notification.
   *
   * @tags dbtn/module:notifications
   * @name send_new_job_alert
   * @summary Send New Job Alert
   * @request POST:/routes/new-job-alert
   */
  send_new_job_alert = (data: AssignmentDetails, params: RequestParams = {}) =>
    this.request<SendNewJobAlertData, SendNewJobAlertError>({
      path: `/routes/new-job-alert`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Lists all assignments with 'open' status, newest first. Accessible only by authenticated users. NOTE: Customer phone number is hidden in this public list for privacy.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name list_open_assignments
   * @summary List Open Assignments
   * @request GET:/routes/assignments/
   */
  list_open_assignments = (params: RequestParams = {}) =>
    this.request<ListOpenAssignmentsData, any>({
      path: `/routes/assignments/`,
      method: "GET",
      ...params,
    });

  /**
   * @description Creates a new assignment for the authenticated user.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name create_assignment
   * @summary Create Assignment
   * @request POST:/routes/assignments/
   */
  create_assignment = (data: CreateAssignmentRequest, params: RequestParams = {}) =>
    this.request<CreateAssignmentData, CreateAssignmentError>({
      path: `/routes/assignments/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Fetches all assignments created by the currently authenticated user (customer). It also checks if a review has been submitted for each assignment.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name get_my_assignments
   * @summary Get My Assignments
   * @request GET:/routes/assignments/my-assignments
   */
  get_my_assignments = (params: RequestParams = {}) =>
    this.request<GetMyAssignmentsData, any>({
      path: `/routes/assignments/my-assignments`,
      method: "GET",
      ...params,
    });

  /**
   * @description Allows a customer to select a craftsman for their assignment.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name select_craftsman
   * @summary Select Craftsman
   * @request POST:/routes/assignments/select-craftsman
   */
  select_craftsman = (data: SelectCraftsmanRequest, params: RequestParams = {}) =>
    this.request<SelectCraftsmanData, SelectCraftsmanError>({
      path: `/routes/assignments/select-craftsman`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Fetches all assignments a craftsman is either assigned to or has shown interest in.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name get_craftsman_assignments
   * @summary Get Craftsman Assignments
   * @request GET:/routes/assignments/craftsman-assignments
   */
  get_craftsman_assignments = (params: RequestParams = {}) =>
    this.request<GetCraftsmanAssignmentsData, any>({
      path: `/routes/assignments/craftsman-assignments`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches a single assignment by its ID. Accessible only by authenticated users. Phone number is only revealed to the customer (owner) or the selected craftsman. Includes interest status for the requesting craftsman.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name get_assignment_by_id
   * @summary Get Assignment By Id
   * @request GET:/routes/assignments/{assignment_id}
   */
  get_assignment_by_id = ({ assignmentId, ...query }: GetAssignmentByIdParams, params: RequestParams = {}) =>
    this.request<GetAssignmentByIdData, GetAssignmentByIdError>({
      path: `/routes/assignments/${assignmentId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Allows a craftsman to express interest in an open assignment.
   *
   * @tags Assignments, dbtn/module:assignments
   * @name register_interest
   * @summary Register Interest
   * @request POST:/routes/assignments/{assignment_id}/interest
   */
  register_interest = ({ assignmentId, ...query }: RegisterInterestParams, params: RequestParams = {}) =>
    this.request<RegisterInterestData, RegisterInterestError>({
      path: `/routes/assignments/${assignmentId}/interest`,
      method: "POST",
      ...params,
    });

  /**
   * @description This endpoint triggers the process of sending AI-generated monthly emails to craftsmen. If target.user_ids is provided, only sends to those users. Otherwise sends to all.
   *
   * @tags Engagement, dbtn/module:engagement
   * @name send_monthly_emails
   * @summary Send Monthly Emails
   * @request POST:/routes/send-monthly-emails
   */
  send_monthly_emails = (data: SendMonthlyEmailsPayload, params: RequestParams = {}) =>
    this.request<SendMonthlyEmailsData, SendMonthlyEmailsError>({
      path: `/routes/send-monthly-emails`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Triggers the '50 kr' launch campaign email.
   *
   * @tags Engagement, dbtn/module:engagement
   * @name send_launch_emails
   * @summary Send Launch Emails
   * @request POST:/routes/send-launch-emails
   */
  send_launch_emails = (data: SendLaunchEmailsPayload, params: RequestParams = {}) =>
    this.request<SendLaunchEmailsData, SendLaunchEmailsError>({
      path: `/routes/send-launch-emails`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Submits a review for a completed assignment. A user can only review an assignment once.
   *
   * @tags Reviews, dbtn/module:reviews
   * @name submit_review
   * @summary Submit Review
   * @request POST:/routes/reviews/
   */
  submit_review = (data: CreateReviewRequest, params: RequestParams = {}) =>
    this.request<SubmitReviewData, SubmitReviewError>({
      path: `/routes/reviews/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Fetches all reviews submitted by the currently authenticated user.
   *
   * @tags Reviews, dbtn/module:reviews
   * @name get_my_reviews
   * @summary Get My Reviews
   * @request GET:/routes/reviews/my-reviews
   */
  get_my_reviews = (params: RequestParams = {}) =>
    this.request<GetMyReviewsData, any>({
      path: `/routes/reviews/my-reviews`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches all reviews for a specific craftsman. Includes the customer's name for display purposes.
   *
   * @tags Reviews, dbtn/module:reviews
   * @name get_reviews_for_craftsman
   * @summary Get Reviews For Craftsman
   * @request GET:/routes/reviews/craftsman/{craftsman_id}
   */
  get_reviews_for_craftsman = ({ craftsmanId, ...query }: GetReviewsForCraftsmanParams, params: RequestParams = {}) =>
    this.request<GetReviewsForCraftsmanData, GetReviewsForCraftsmanError>({
      path: `/routes/reviews/craftsman/${craftsmanId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Returns a hardcoded list of affiliate products. This serves as a placeholder until a dynamic system is implemented.
   *
   * @tags dbtn/module:affiliate_products
   * @name list_affiliate_products2
   * @summary List Affiliate Products2
   * @request GET:/routes/affiliate-products
   */
  list_affiliate_products2 = (params: RequestParams = {}) =>
    this.request<ListAffiliateProducts2Data, any>({
      path: `/routes/affiliate-products`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches all available lead packages/products.
   *
   * @tags dbtn/module:stripe
   * @name list_products
   * @summary List Products
   * @request GET:/routes/products
   */
  list_products = (params: RequestParams = {}) =>
    this.request<ListProductsData, any>({
      path: `/routes/products`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches the payment history for the logged-in craftsman.
   *
   * @tags dbtn/module:stripe
   * @name get_payment_history
   * @summary Get Payment History
   * @request GET:/routes/payment-history
   */
  get_payment_history = (params: RequestParams = {}) =>
    this.request<GetPaymentHistoryData, any>({
      path: `/routes/payment-history`,
      method: "GET",
      ...params,
    });

  /**
   * @description Creates a Stripe Checkout Session for buying leads or unlocking an assignment.
   *
   * @tags dbtn/module:stripe
   * @name create_checkout_session
   * @summary Create Checkout Session
   * @request POST:/routes/create-checkout-session
   */
  create_checkout_session = (data: import("./data-contracts").CreateCheckoutSessionPayload, params: RequestParams = {}) =>
    this.request<CreateCheckoutSessionData, any>({
      path: `/routes/create-checkout-session`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Handles incoming webhooks from Stripe.
   *
   * @tags dbtn/module:stripe
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/webhook
   */
  stripe_webhook = (params: RequestParams = {}) =>
    this.request<StripeWebhookData, any>({
      path: `/routes/webhook`,
      method: "POST",
      ...params,
    });

  /**
   * @description Lists all available affiliate products. This endpoint provides a list of curated products and services relevant to craftsmen. It's used to display partner deals on the craftsman's dashboard.
   *
   * @tags products, dbtn/module:products
   * @name list_affiliate_products
   * @summary List Affiliate Products
   * @request GET:/routes/products/
   */
  list_affiliate_products = (params: RequestParams = {}) =>
    this.request<ListAffiliateProductsData, any>({
      path: `/routes/products/`,
      method: "GET",
      ...params,
    });

  /**
   * @description Provides publicly safe contact information, like the company's main phone number.
   *
   * @tags dbtn/module:contact
   * @name get_public_contact_details
   * @summary Get Public Contact Details
   * @request GET:/routes/contact-details
   */
  get_public_contact_details = (params: RequestParams = {}) =>
    this.request<GetPublicContactDetailsData, any>({
      path: `/routes/contact-details`,
      method: "GET",
      ...params,
    });

  /**
   * @description Fetches the profile for the currently authenticated craftsman. Returns a default empty profile if one doesn't exist.
   *
   * @tags dbtn/module:craftsmen
   * @name get_current_craftsman_profile
   * @summary Get Current Craftsman Profile
   * @request GET:/routes/craftsmen/me
   */
  get_current_craftsman_profile = (params: RequestParams = {}) =>
    this.request<GetCurrentCraftsmanProfileData, any>({
      path: `/routes/craftsmen/me`,
      method: "GET",
      ...params,
    });

  /**
   * @description Creates or updates a craftsman's profile using a robust transaction.
   *
   * @tags dbtn/module:craftsmen
   * @name update_craftsman_profile
   * @summary Update Craftsman Profile
   * @request PUT:/routes/craftsmen/profile
   */
  update_craftsman_profile = (data: UpdateCraftsmanProfile, params: RequestParams = {}) =>
    this.request<UpdateCraftsmanProfileData, UpdateCraftsmanProfileError>({
      path: `/routes/craftsmen/profile`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:craftsmen
   * @name upload_profile_photo
   * @summary Upload Profile Photo
   * @request POST:/routes/craftsmen/upload-profile-photo
   */
  upload_profile_photo = (data: BodyUploadProfilePhoto, params: RequestParams = {}) =>
    this.request<UploadProfilePhotoData, UploadProfilePhotoError>({
      path: `/routes/craftsmen/upload-profile-photo`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:craftsmen
   * @name upload_id_document
   * @summary Upload Id Document
   * @request POST:/routes/craftsmen/upload-id-document
   */
  upload_id_document = (data: BodyUploadIdDocument, params: RequestParams = {}) =>
    this.request<UploadIdDocumentData, UploadIdDocumentError>({
      path: `/routes/craftsmen/upload-id-document`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:craftsmen
   * @name get_craftsman_asset
   * @summary Get Craftsman Asset
   * @request GET:/routes/craftsmen/assets/{filename}
   */
  get_craftsman_asset = ({ filename, ...query }: GetCraftsmanAssetParams, params: RequestParams = {}) =>
    this.request<GetCraftsmanAssetData, GetCraftsmanAssetError>({
      path: `/routes/craftsmen/assets/${filename}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Searches for craftsmen based on a search term, services offered, and service areas.
   *
   * @tags dbtn/module:craftsmen
   * @name search_craftsmen
   * @summary Search Craftsmen
   * @request GET:/routes/craftsmen/search
   */
  search_craftsmen = (query: SearchCraftsmenParams, params: RequestParams = {}) =>
    this.request<SearchCraftsmenData, SearchCraftsmenError>({
      path: `/routes/craftsmen/search`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Fetches the public profile for a specific craftsman by their ID.
   *
   * @tags dbtn/module:craftsmen
   * @name get_craftsman_profile_by_id
   * @summary Get Craftsman Profile By Id
   * @request GET:/routes/craftsmen/{craftsman_id}
   */
  get_craftsman_profile_by_id = (
    { craftsmanId, ...query }: GetCraftsmanProfileByIdParams,
    params: RequestParams = {},
  ) =>
    this.request<GetCraftsmanProfileByIdData, GetCraftsmanProfileByIdError>({
      path: `/routes/craftsmen/${craftsmanId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Lists all registered craftsmen. TODO: Add strictly admin-only authorization.
   *
   * @tags Admin, dbtn/module:admin
   * @name list_all_craftsmen
   * @summary List All Craftsmen
   * @request GET:/routes/admin/craftsmen
   */
  list_all_craftsmen = (params: RequestParams = {}) =>
    this.request<ListAllCraftsmenData, any>({
      path: `/routes/admin/craftsmen`,
      method: "GET",
      ...params,
    });

  /**
   * @description Approves a craftsman's manual verification.
   *
   * @tags Admin, dbtn/module:admin
   * @name approve_craftsman
   * @summary Approve Craftsman
   * @request POST:/routes/admin/craftsmen/{user_id}/approve
   */
  approve_craftsman = ({ userId, ...query }: ApproveCraftsmanParams, params: RequestParams = {}) =>
    this.request<ApproveCraftsmanData, ApproveCraftsmanError>({
      path: `/routes/admin/craftsmen/${userId}/approve`,
      method: "POST",
      ...params,
    });

  /**
   * @description Deletes a craftsman profile.
   *
   * @tags Admin, dbtn/module:admin
   * @name delete_craftsman
   * @summary Delete Craftsman
   * @request DELETE:/routes/admin/craftsmen/{user_id}
   */
  delete_craftsman = ({ userId, ...query }: DeleteCraftsmanParams, params: RequestParams = {}) =>
    this.request<DeleteCraftsmanData, DeleteCraftsmanError>({
      path: `/routes/admin/craftsmen/${userId}`,
      method: "DELETE",
      ...params,
    });
}
