import {
  ApproveCraftsmanData,
  AssignmentDetails,
  BodyUploadIdDocument,
  BodyUploadProfilePhoto,
  CheckHealthData,
  CreateAssignmentData,
  CreateAssignmentRequest,
  CreateCheckoutSessionData,
  CreateReviewRequest,
  DeleteCraftsmanData,
  FinalizeBankidVerificationData,
  FinalizeVerificationRequest,
  GetAssignmentByIdData,
  GetCraftsmanAssetData,
  GetCraftsmanAssignmentsData,
  GetCraftsmanProfileByIdData,
  GetCurrentCraftsmanProfileData,
  GetMyAssignmentsData,
  GetMyReviewsData,
  GetPaymentHistoryData,
  GetPublicContactDetailsData,
  GetReviewsForCraftsmanData,
  InitiateBankidVerificationData,
  InitiateVerificationRequest,
  ListAffiliateProducts2Data,
  ListAffiliateProductsData,
  ListAllCraftsmenData,
  ListOpenAssignmentsData,
  ListProductsData,
  RegisterInterestData,
  SearchCraftsmenData,
  SelectCraftsmanData,
  SelectCraftsmanRequest,
  SendLaunchEmailsData,
  SendLaunchEmailsPayload,
  SendMonthlyEmailsData,
  SendMonthlyEmailsPayload,
  SendNewJobAlertData,
  StripeWebhookData,
  SubmitReviewData,
  UpdateCraftsmanProfile,
  UpdateCraftsmanProfileData,
  UploadIdDocumentData,
  UploadProfilePhotoData,
} from "./data-contracts";

export namespace Apiclient {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Initiates a BankID verification process for the logged-in craftsman. This endpoint communicates with the Criipto API to create a verification session.
   * @tags dbtn/module:bankid_verification
   * @name initiate_bankid_verification
   * @summary Initiate Bankid Verification
   * @request POST:/routes/initiate-bankid-verification
   */
  export namespace initiate_bankid_verification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = InitiateVerificationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = InitiateBankidVerificationData;
  }

  /**
   * @description Finalizes the verification process. Called by the frontend after receiving the code and state from Criipto.
   * @tags dbtn/module:bankid_verification
   * @name finalize_bankid_verification
   * @summary Finalize Bankid Verification
   * @request POST:/routes/finalize-bankid-verification
   */
  export namespace finalize_bankid_verification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = FinalizeVerificationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = FinalizeBankidVerificationData;
  }

  /**
   * @description This endpoint is triggered when a new service request is created. It finds matching craftsmen and sends them an email notification.
   * @tags dbtn/module:notifications
   * @name send_new_job_alert
   * @summary Send New Job Alert
   * @request POST:/routes/new-job-alert
   */
  export namespace send_new_job_alert {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AssignmentDetails;
    export type RequestHeaders = {};
    export type ResponseBody = SendNewJobAlertData;
  }

  /**
   * @description Lists all assignments with 'open' status, newest first. Accessible only by authenticated users. NOTE: Customer phone number is hidden in this public list for privacy.
   * @tags Assignments, dbtn/module:assignments
   * @name list_open_assignments
   * @summary List Open Assignments
   * @request GET:/routes/assignments/
   */
  export namespace list_open_assignments {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListOpenAssignmentsData;
  }

  /**
   * @description Creates a new assignment for the authenticated user.
   * @tags Assignments, dbtn/module:assignments
   * @name create_assignment
   * @summary Create Assignment
   * @request POST:/routes/assignments/
   */
  export namespace create_assignment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateAssignmentRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateAssignmentData;
  }

  /**
   * @description Fetches all assignments created by the currently authenticated user (customer). It also checks if a review has been submitted for each assignment.
   * @tags Assignments, dbtn/module:assignments
   * @name get_my_assignments
   * @summary Get My Assignments
   * @request GET:/routes/assignments/my-assignments
   */
  export namespace get_my_assignments {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMyAssignmentsData;
  }

  /**
   * @description Allows a customer to select a craftsman for their assignment.
   * @tags Assignments, dbtn/module:assignments
   * @name select_craftsman
   * @summary Select Craftsman
   * @request POST:/routes/assignments/select-craftsman
   */
  export namespace select_craftsman {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SelectCraftsmanRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SelectCraftsmanData;
  }

  /**
   * @description Fetches all assignments a craftsman is either assigned to or has shown interest in.
   * @tags Assignments, dbtn/module:assignments
   * @name get_craftsman_assignments
   * @summary Get Craftsman Assignments
   * @request GET:/routes/assignments/craftsman-assignments
   */
  export namespace get_craftsman_assignments {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCraftsmanAssignmentsData;
  }

  /**
   * @description Fetches a single assignment by its ID. Accessible only by authenticated users. Phone number is only revealed to the customer (owner) or the selected craftsman. Includes interest status for the requesting craftsman.
   * @tags Assignments, dbtn/module:assignments
   * @name get_assignment_by_id
   * @summary Get Assignment By Id
   * @request GET:/routes/assignments/{assignment_id}
   */
  export namespace get_assignment_by_id {
    export type RequestParams = {
      /** Assignment Id */
      assignmentId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetAssignmentByIdData;
  }

  /**
   * @description Allows a craftsman to express interest in an open assignment.
   * @tags Assignments, dbtn/module:assignments
   * @name register_interest
   * @summary Register Interest
   * @request POST:/routes/assignments/{assignment_id}/interest
   */
  export namespace register_interest {
    export type RequestParams = {
      /** Assignment Id */
      assignmentId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterInterestData;
  }

  /**
   * @description This endpoint triggers the process of sending AI-generated monthly emails to craftsmen. If target.user_ids is provided, only sends to those users. Otherwise sends to all.
   * @tags Engagement, dbtn/module:engagement
   * @name send_monthly_emails
   * @summary Send Monthly Emails
   * @request POST:/routes/send-monthly-emails
   */
  export namespace send_monthly_emails {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendMonthlyEmailsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = SendMonthlyEmailsData;
  }

  /**
   * @description Triggers the '50 kr' launch campaign email.
   * @tags Engagement, dbtn/module:engagement
   * @name send_launch_emails
   * @summary Send Launch Emails
   * @request POST:/routes/send-launch-emails
   */
  export namespace send_launch_emails {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendLaunchEmailsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = SendLaunchEmailsData;
  }

  /**
   * @description Submits a review for a completed assignment. A user can only review an assignment once.
   * @tags Reviews, dbtn/module:reviews
   * @name submit_review
   * @summary Submit Review
   * @request POST:/routes/reviews/
   */
  export namespace submit_review {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateReviewRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SubmitReviewData;
  }

  /**
   * @description Fetches all reviews submitted by the currently authenticated user.
   * @tags Reviews, dbtn/module:reviews
   * @name get_my_reviews
   * @summary Get My Reviews
   * @request GET:/routes/reviews/my-reviews
   */
  export namespace get_my_reviews {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetMyReviewsData;
  }

  /**
   * @description Fetches all reviews for a specific craftsman. Includes the customer's name for display purposes.
   * @tags Reviews, dbtn/module:reviews
   * @name get_reviews_for_craftsman
   * @summary Get Reviews For Craftsman
   * @request GET:/routes/reviews/craftsman/{craftsman_id}
   */
  export namespace get_reviews_for_craftsman {
    export type RequestParams = {
      /**
       * Craftsman Id
       * @format uuid
       */
      craftsmanId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetReviewsForCraftsmanData;
  }

  /**
   * @description Returns a hardcoded list of affiliate products. This serves as a placeholder until a dynamic system is implemented.
   * @tags dbtn/module:affiliate_products
   * @name list_affiliate_products2
   * @summary List Affiliate Products2
   * @request GET:/routes/affiliate-products
   */
  export namespace list_affiliate_products2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListAffiliateProducts2Data;
  }

  /**
   * @description Fetches all available lead packages/products.
   * @tags dbtn/module:stripe
   * @name list_products
   * @summary List Products
   * @request GET:/routes/products
   */
  export namespace list_products {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListProductsData;
  }

  /**
   * @description Fetches the payment history for the logged-in craftsman.
   * @tags dbtn/module:stripe
   * @name get_payment_history
   * @summary Get Payment History
   * @request GET:/routes/payment-history
   */
  export namespace get_payment_history {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPaymentHistoryData;
  }

  /**
   * @description Creates a Stripe Checkout Session for buying leads or unlocking an assignment.
   * @tags dbtn/module:stripe
   * @name create_checkout_session
   * @summary Create Checkout Session
   * @request POST:/routes/create-checkout-session
   */
  export namespace create_checkout_session {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CreateCheckoutSessionData;
  }

  /**
   * @description Handles incoming webhooks from Stripe.
   * @tags dbtn/module:stripe
   * @name stripe_webhook
   * @summary Stripe Webhook
   * @request POST:/routes/webhook
   */
  export namespace stripe_webhook {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StripeWebhookData;
  }

  /**
   * @description Lists all available affiliate products. This endpoint provides a list of curated products and services relevant to craftsmen. It's used to display partner deals on the craftsman's dashboard.
   * @tags products, dbtn/module:products
   * @name list_affiliate_products
   * @summary List Affiliate Products
   * @request GET:/routes/products/
   */
  export namespace list_affiliate_products {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListAffiliateProductsData;
  }

  /**
   * @description Provides publicly safe contact information, like the company's main phone number.
   * @tags dbtn/module:contact
   * @name get_public_contact_details
   * @summary Get Public Contact Details
   * @request GET:/routes/contact-details
   */
  export namespace get_public_contact_details {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPublicContactDetailsData;
  }

  /**
   * @description Fetches the profile for the currently authenticated craftsman. Returns a default empty profile if one doesn't exist.
   * @tags dbtn/module:craftsmen
   * @name get_current_craftsman_profile
   * @summary Get Current Craftsman Profile
   * @request GET:/routes/craftsmen/me
   */
  export namespace get_current_craftsman_profile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCurrentCraftsmanProfileData;
  }

  /**
   * @description Creates or updates a craftsman's profile using a robust transaction.
   * @tags dbtn/module:craftsmen
   * @name update_craftsman_profile
   * @summary Update Craftsman Profile
   * @request PUT:/routes/craftsmen/profile
   */
  export namespace update_craftsman_profile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UpdateCraftsmanProfile;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateCraftsmanProfileData;
  }

  /**
   * No description
   * @tags dbtn/module:craftsmen
   * @name upload_profile_photo
   * @summary Upload Profile Photo
   * @request POST:/routes/craftsmen/upload-profile-photo
   */
  export namespace upload_profile_photo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadProfilePhoto;
    export type RequestHeaders = {};
    export type ResponseBody = UploadProfilePhotoData;
  }

  /**
   * No description
   * @tags dbtn/module:craftsmen
   * @name upload_id_document
   * @summary Upload Id Document
   * @request POST:/routes/craftsmen/upload-id-document
   */
  export namespace upload_id_document {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadIdDocument;
    export type RequestHeaders = {};
    export type ResponseBody = UploadIdDocumentData;
  }

  /**
   * No description
   * @tags dbtn/module:craftsmen
   * @name get_craftsman_asset
   * @summary Get Craftsman Asset
   * @request GET:/routes/craftsmen/assets/{filename}
   */
  export namespace get_craftsman_asset {
    export type RequestParams = {
      /** Filename */
      filename: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCraftsmanAssetData;
  }

  /**
   * @description Searches for craftsmen based on a search term, services offered, and service areas.
   * @tags dbtn/module:craftsmen
   * @name search_craftsmen
   * @summary Search Craftsmen
   * @request GET:/routes/craftsmen/search
   */
  export namespace search_craftsmen {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Searchterm */
      searchTerm?: string | null;
      /** Services */
      services?: string[] | null;
      /** Areas */
      areas?: string[] | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SearchCraftsmenData;
  }

  /**
   * @description Fetches the public profile for a specific craftsman by their ID.
   * @tags dbtn/module:craftsmen
   * @name get_craftsman_profile_by_id
   * @summary Get Craftsman Profile By Id
   * @request GET:/routes/craftsmen/{craftsman_id}
   */
  export namespace get_craftsman_profile_by_id {
    export type RequestParams = {
      /** Craftsman Id */
      craftsmanId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCraftsmanProfileByIdData;
  }

  /**
   * @description Lists all registered craftsmen. TODO: Add strictly admin-only authorization.
   * @tags Admin, dbtn/module:admin
   * @name list_all_craftsmen
   * @summary List All Craftsmen
   * @request GET:/routes/admin/craftsmen
   */
  export namespace list_all_craftsmen {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ListAllCraftsmenData;
  }

  /**
   * @description Approves a craftsman's manual verification.
   * @tags Admin, dbtn/module:admin
   * @name approve_craftsman
   * @summary Approve Craftsman
   * @request POST:/routes/admin/craftsmen/{user_id}/approve
   */
  export namespace approve_craftsman {
    export type RequestParams = {
      /** User Id */
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ApproveCraftsmanData;
  }

  /**
   * @description Deletes a craftsman profile.
   * @tags Admin, dbtn/module:admin
   * @name delete_craftsman
   * @summary Delete Craftsman
   * @request DELETE:/routes/admin/craftsmen/{user_id}
   */
  export namespace delete_craftsman {
    export type RequestParams = {
      /** User Id */
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteCraftsmanData;
  }
}
