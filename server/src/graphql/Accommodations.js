import reviews from './reviews.json';

export class Accommodations {
  // compute all rankings once on the data import stage, no need to do it for each request
  constructor() {
    this.computedRanking = {};

    (() => {
      const now = new Date();
      const fiveYearsAgoDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
      const fiveYearsAgoTimestamp = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate()).getTime();
      const accommodations = this.getAccommodations();

      accommodations.forEach((id) => {
        const accReviews = this.getReviews(id);
        const numberOfReviews = accReviews.length
        let generalRating = 0;
        let aspectsRating = {};

        accReviews.forEach((review) => {
          let weight = 0.5;
          if (review.entryDate >= fiveYearsAgoTimestamp) {
            let entryDate = new Date(review.entryDate),
              fixYear = 0;
            // FixYear - need for situations when entryDate year is five years ago,
            // however current month is less than entry month
            // as well as when current month less then entry month(and day) -
            // will create correct weight relying on month, not only publication year
            // (for current data file in this case we will have at least a few comments with weight = 0.6)

            if (entryDate.getMonth() > now.getMonth() || (entryDate.getMonth() == now.getMonth() && entryDate.getDate() > now.getDate())) {
              fixYear = 1;
            }

            weight = 1 - (now.getFullYear() - entryDate.getFullYear() - fixYear) * 0.1;
          }

          generalRating += review.ratings.general.general * weight;
          Object.keys(review.ratings.aspects).forEach((aspect) => {
            if (!aspectsRating[aspect]) {
              aspectsRating[aspect] = 0;
            }

            aspectsRating[aspect] += review.ratings.aspects[aspect] * weight;
          });
        })

        Object.keys(aspectsRating).forEach((aspect) => aspectsRating[aspect] /= numberOfReviews);
        this.computedRanking[id] = {
          general: generalRating / numberOfReviews,
          aspects: aspectsRating
        };
      });
    })();
  };

  getTraveledWith() {
    let traveledWith = []

    reviews.forEach((review) => {
      if (traveledWith.indexOf(review.traveledWith.toLowerCase()) === -1) {
        traveledWith.push(review.traveledWith.toLowerCase());
      }
    });

    return traveledWith.sort();
  }

  getAccommodations() {
    let accommodations = []

    reviews.forEach((review) => {
      if (Array.isArray(review.parents)) {
        review.parents.forEach((parent) => {
          if (accommodations.indexOf(parent.id) === -1) {
            accommodations.push(parent.id);
          }
        });
      }
    });

    return accommodations.sort();
  }

  getAccommodation(id) {
    let accommodations = []

    return { id };
  }

  getReviews(accommodation_id) {
    let accReviews = []

    reviews.forEach((review) => {
      if (review.parents.find((el) => el.id === accommodation_id)) {
        accReviews.push(review);
      }
    });

    return accReviews;
  }

  getAccommodationRanking(id) {
    return this.computedRanking[id];
  }

  getReviewTitle(review) {
    return review.titles[review.locale];
  }

  getReviewText(review) {
    return review.texts[review.locale];
  }
}
