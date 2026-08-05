package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.entity.Reviewer;
import com.tspmquestionmaster.repository.ReviewerRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewerLookupServiceImplTest {

    @Mock
    private ReviewerRepository reviewerRepository;

    @InjectMocks
    private ReviewerLookupServiceImpl reviewerLookupService;

    @Test
    void getReviewersByTeam_success() {

        Reviewer reviewer1 = new Reviewer();
        reviewer1.setId(1L);

        Reviewer reviewer2 = new Reviewer();
        reviewer2.setId(2L);

        List<Reviewer> reviewers = List.of(
                reviewer1,
                reviewer2
        );

        when(reviewerRepository.findByTeamId(10L))
                .thenReturn(reviewers);

        List<Reviewer> result =
                reviewerLookupService.getReviewersByTeam(10L);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());

        verify(reviewerRepository)
                .findByTeamId(10L);
    }

    @Test
    void getReviewersByTeam_emptyList() {

        when(reviewerRepository.findByTeamId(99L))
                .thenReturn(List.of());

        List<Reviewer> result =
                reviewerLookupService.getReviewersByTeam(99L);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(reviewerRepository)
                .findByTeamId(99L);
    }
}